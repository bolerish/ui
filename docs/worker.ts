import { siteOrigin } from "./src/shared/lib/site.ts";

type Assets = { fetch(request: Request): Promise<Response> };

export default {
  fetch(request: Request, env: { ASSETS: Assets }) {
    const url = new URL(request.url);
    const canonical = new URL(siteOrigin);
    const productionHost =
      url.hostname === canonical.hostname || url.hostname === "bolerish-docs.myjeong19.workers.dev";
    if (productionHost && url.origin !== canonical.origin) {
      return Response.redirect(`${siteOrigin}${url.pathname}${url.search}`, 308);
    }
    return env.ASSETS.fetch(request);
  },
};
