import { createStateStore } from "@json-render/core";
import type { Spec, StateStore } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import { Component, useEffect, useRef, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";

import { parseDraft, renderRequestSchema } from "./contracts";
import type { PreviewAdapter } from "./contracts";
import { designSystems } from "./design-systems";

type PreviewSession = {
  key: number;
  fileId: string;
  source: string;
  adapter: PreviewAdapter;
  store: StateStore;
  spec: Spec;
  handlers: ReturnType<PreviewAdapter["createHandlers"]>;
};

export default function Canvas() {
  const [session, setSession] = useState<PreviewSession | null>(null);
  const current = useRef<PreviewSession | null>(null);
  const generation = useRef(0);
  const revision = useRef(0);

  useEffect(() => {
    let disposed = false;
    function reportError(error: unknown) {
      parent.postMessage(
        {
          type: "preview:status",
          revision: revision.current,
          status: "error",
          message: error instanceof Error ? error.message : "시안 렌더링 중 오류가 발생했어요.",
        },
        location.origin,
      );
    }
    async function onMessage(event: MessageEvent) {
      if (event.origin !== location.origin || event.source !== parent) return;
      const result = renderRequestSchema.safeParse(event.data);
      if (!result.success) return;
      const request = result.data;
      if (request.revision < revision.current) return;
      revision.current = request.revision;
      const requestGeneration = ++generation.current;
      try {
        const draft = parseDraft(request.source);
        const registration = Object.hasOwn(designSystems, draft.designSystem)
          ? designSystems[draft.designSystem]
          : undefined;
        if (!registration)
          throw new Error(`등록되지 않은 디자인 시스템이에요: ${draft.designSystem}`);
        if (!registration.themes.some((theme) => theme.id === request.theme))
          throw new Error(`지원하지 않는 테마예요: ${request.theme}`);
        if (
          current.current?.fileId === request.fileId &&
          current.current.source === request.source
        ) {
          current.current.adapter.applyTheme(document, request.theme);
        } else {
          current.current = null;
          setSession(null);
          const adapter = await registration.load();
          if (disposed || requestGeneration !== generation.current) return;
          const spec = adapter.parse(draft.spec, draft.state, draft.example);
          const store = createStateStore(draft.state);
          const handlers = adapter.createHandlers(store, draft.example);
          adapter.applyTheme(document, request.theme);
          const next = {
            key: request.revision,
            fileId: request.fileId,
            source: request.source,
            adapter,
            spec,
            store,
            handlers,
          };
          current.current = next;
          setSession(next);
        }
        parent.postMessage(
          { type: "preview:status", revision: request.revision, status: "ready" },
          location.origin,
        );
      } catch (error) {
        if (disposed || requestGeneration !== generation.current) return;
        current.current = null;
        setSession(null);
        reportError(error);
      }
    }
    function onError(event: ErrorEvent) {
      reportError(event.error ?? event.message);
    }
    function onRejection(event: PromiseRejectionEvent) {
      reportError(event.reason);
    }
    window.addEventListener("message", onMessage);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    parent.postMessage({ type: "preview:ready" }, location.origin);
    return () => {
      disposed = true;
      window.removeEventListener("message", onMessage);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (!session) return null;
  return (
    <RenderBoundary
      key={session.key}
      onError={(error) => {
        current.current = null;
        parent.postMessage(
          {
            type: "preview:status",
            revision: revision.current,
            status: "error",
            message: error.message,
          },
          location.origin,
        );
      }}
    >
      <JSONUIProvider
        registry={session.adapter.registry}
        store={session.store}
        handlers={session.handlers}
      >
        <Renderer spec={session.spec} registry={session.adapter.registry} />
      </JSONUIProvider>
    </RenderBoundary>
  );
}

class RenderBoundary extends Component<
  { children: ReactNode; onError(error: Error): void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, _info: ErrorInfo) {
    this.props.onError(error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
