export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) {
      return response;
    }

    const url = new URL(request.url);
    if (url.pathname.startsWith("/api")) {
      return new Response("Not found", { status: 404 });
    }

    return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
  }
};
