import type { Page, TestInfo } from "@playwright/test";

/** Opt-in runtime observations; this does not change navigation assertions or retries. */
export async function navigationDiagnostics(page: Page, info: TestInfo, run: () => Promise<void>) {
  if (process.env.DOCS_NAV_DIAGNOSTICS !== "1") return run();

  const events: Array<Record<string, unknown>> = [];
  const record = (kind: string, data: unknown) => {
    events.push({ time: new Date().toISOString(), kind, url: page.url(), data });
  };
  page.on("console", (message) =>
    record("console", { type: message.type(), text: message.text() }),
  );
  page.on("pageerror", (error) => record("pageerror", error.message));
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) record("frame", frame.url());
  });
  page.on("request", (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      record("request", { url: request.url(), redirectedFrom: request.redirectedFrom()?.url() });
  });
  page.on("requestfailed", (request) => {
    record("requestfailed", { url: request.url(), failure: request.failure() });
  });
  page.on("response", (response) => {
    const request = response.request();
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      record("response", {
        url: response.url(),
        status: response.status(),
        location: response.headers().location,
      });
  });

  await page.addInitScript(() => {
    const observe = (kind: string, data: unknown) =>
      console.debug(
        "DOCS_NAV_DIAGNOSTICS " +
          JSON.stringify({
            time: new Date().toISOString(),
            kind,
            href: location.href,
            data,
            stack: new Error().stack,
          }),
      );
    for (const method of ["pushState", "replaceState"] as const) {
      const original = history[method].bind(history);
      history[method] = (...args: Parameters<History[typeof method]>) => {
        observe(method, { state: args[0], url: args[2] });
        return Reflect.apply(original, history, args);
      };
    }
    type DiagnosticRouter = {
      state?: { location?: unknown };
      navigate: (...args: unknown[]) => unknown;
    };
    let router: DiagnosticRouter | undefined;
    Object.defineProperty(window, "__TSR_ROUTER__", {
      configurable: true,
      get: () => router,
      set(value: DiagnosticRouter) {
        router = value;
        const navigate = value.navigate;
        value.navigate = function (...args) {
          observe("router.navigate", { args, location: value.state?.location });
          return navigate.apply(this, args);
        };
      },
    });
  });

  // Location is unforgeable in WebKit. Instrument only the served JS call site.
  await page.route(/\/assets\/.*\.js(?:\?.*)?$/, async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replaceAll(
      "window.location.replace(",
      '((...args)=>{console.trace("DOCS_NAV_DIAGNOSTICS location.replace",location.href,JSON.stringify(args),new Error().stack);return window.location.replace(...args)})( ',
    );
    await route.fulfill({ response, body });
  });

  const snapshot = async (phase: string) => {
    try {
      record(
        phase,
        await page.evaluate(() => ({
          url: location.href,
          history: history.state,
          routerLocation: (
            window as unknown as { __TSR_ROUTER__?: { state?: { location?: unknown } } }
          ).__TSR_ROUTER__?.state?.location,
        })),
      );
    } catch (error) {
      record(phase, { error: String(error) });
    }
  };
  try {
    await run();
  } catch (error) {
    record("failure", String(error));
    await snapshot("failure-immediate");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await snapshot("failure-after-1s");
    const body = JSON.stringify(events, null, 2);
    console.log(`DOCS_NAV_DIAGNOSTICS ${info.title}\n${body}`);
    await info.attach("navigation-diagnostics", { body, contentType: "application/json" });
    throw error;
  }
}
