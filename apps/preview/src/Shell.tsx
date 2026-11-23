import "@bolerish/ui/global.css";
import { Banner, BannerContent, BannerDescription, BannerTitle } from "@bolerish/ui/banner";
import { Card, CardContent, CardHeader } from "@bolerish/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@bolerish/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@bolerish/ui/field";
import { Heading } from "@bolerish/ui/heading";
import { NativeSelect, NativeSelectOption } from "@bolerish/ui/native-select";
import { Paragraph } from "@bolerish/ui/paragraph";
import { useEffect, useRef, useState } from "react";

import { canvasReadySchema, canvasStatusSchema, parseDraft } from "./contracts";
import type { RenderRequest } from "./contracts";
import { designSystems } from "./design-systems";
import { useDraftSources } from "./drafts";

import "./shell.css";

export default function Shell() {
  const files = useDraftSources();
  const fileIds = Object.keys(files).sort();
  const [selected, setSelected] = useState("");
  const fileId = Object.hasOwn(files, selected) ? selected : fileIds[0];
  const source = fileId ? files[fileId] : "";
  const [width, setWidth] = useState("fill");
  const [chosenTheme, setTheme] = useState("light");
  const [status, setStatus] = useState<{
    status: string;
    message?: string;
    source?: string;
    fileId?: string;
  }>({ status: "loading" });
  const frame = useRef<HTMLIFrameElement>(null);
  const [readyRevision, setReadyRevision] = useState(0);
  const latestRequest = useRef<RenderRequest | null>(null);
  const revision = useRef(0);
  let designSystem = "";
  let parseError = "";
  try {
    if (source) designSystem = parseDraft(source).designSystem;
  } catch (error) {
    parseError = describeError(error);
  }
  const registration = Object.hasOwn(designSystems, designSystem)
    ? designSystems[designSystem]
    : undefined;
  const themes = registration?.themes ?? [];
  const theme = themes.some((item) => item.id === chosenTheme)
    ? chosenTheme
    : (themes[0]?.id ?? "");
  const activeStatus =
    status.source === source && status.fileId === fileId ? status : { status: "loading" };
  const visibleError =
    parseError ||
    (designSystem && !registration ? `등록되지 않은 디자인 시스템이에요: ${designSystem}` : "") ||
    (activeStatus.status === "error" ? activeStatus.message : "");

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow) return;
      if (canvasReadySchema.safeParse(event.data).success) {
        setReadyRevision((value) => value + 1);
        return;
      }
      const result = canvasStatusSchema.safeParse(event.data);
      if (result.success && result.data.revision === revision.current && latestRequest.current)
        setStatus({
          ...result.data,
          source: latestRequest.current.source,
          fileId: latestRequest.current.fileId,
        });
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!readyRevision || !fileId) return;
    const message: RenderRequest = {
      type: "preview:render",
      revision: ++revision.current,
      fileId,
      source,
      theme,
    };
    latestRequest.current = message;
    frame.current?.contentWindow?.postMessage(message, location.origin);
  }, [readyRevision, fileId, source, theme]);

  return (
    <Card className="preview-shell">
      <CardHeader>
        <Heading level={1} size="page">
          시안 미리보기
        </Heading>
        <Paragraph variant="description">
          drafts 폴더의 JSON 파일을 수정하면 선택한 시안에 바로 반영돼요.
        </Paragraph>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldGroup className="preview-toolbar">
            <Field>
              <FieldLabel htmlFor="draft">시안</FieldLabel>
              <NativeSelect
                id="draft"
                value={fileId ?? ""}
                disabled={!fileId}
                onChange={(event) => setSelected(event.target.value)}
              >
                {fileIds.length ? (
                  fileIds.map((id) => (
                    <NativeSelectOption key={id} value={id}>
                      {id.split("/").at(-1)}
                    </NativeSelectOption>
                  ))
                ) : (
                  <NativeSelectOption value="">시안 없음</NativeSelectOption>
                )}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="width">미리보기 너비</FieldLabel>
              <NativeSelect
                id="width"
                value={width}
                onChange={(event) => setWidth(event.target.value)}
              >
                <NativeSelectOption value="fill">채우기</NativeSelectOption>
                {[390, 768, 1280].map((size) => (
                  <NativeSelectOption key={size} value={String(size)}>
                    {size}px
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="theme">미리보기 테마</FieldLabel>
              <NativeSelect
                id="theme"
                value={theme}
                disabled={!themes.length}
                onChange={(event) => setTheme(event.target.value)}
              >
                {themes.length ? (
                  themes.map((item) => (
                    <NativeSelectOption key={item.id} value={item.id}>
                      {item.label}
                    </NativeSelectOption>
                  ))
                ) : (
                  <NativeSelectOption value="">지원 테마 없음</NativeSelectOption>
                )}
              </NativeSelect>
            </Field>
          </FieldGroup>
          {visibleError ? (
            <Banner announce="assertive">
              <BannerContent>
                <BannerTitle>시안을 표시하지 못했어요</BannerTitle>
                <BannerDescription>{visibleError}</BannerDescription>
              </BannerContent>
            </Banner>
          ) : null}
          {!fileId ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>저장된 시안이 없어요</EmptyTitle>
                <EmptyDescription>
                  apps/preview/drafts 폴더에 JSON 파일을 추가하세요.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <Paragraph variant="caption" aria-live="polite">
                {fileId.split("/").at(-1)} · {registration?.label ?? designSystem} ·{" "}
                {activeStatus.status === "loading"
                  ? "불러오는 중"
                  : activeStatus.status === "error" || visibleError
                    ? "오류"
                    : "자동 갱신됨"}
              </Paragraph>
              <div className="preview-stage">
                <iframe
                  key={designSystem}
                  ref={frame}
                  title="선택한 시안"
                  src="/?canvas"
                  className="preview-frame"
                  style={{ width: width === "fill" ? "100%" : `${width}px` }}
                />
              </div>
            </>
          )}
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

function describeError(error: unknown) {
  return error instanceof Error ? error.message : "파일을 읽지 못했어요.";
}
