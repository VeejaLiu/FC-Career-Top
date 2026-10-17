// Keep browser authentication on the Admin origin. The API service binding
// forwards HttpOnly cookies without putting credentials in JavaScript storage.
export default {
  async fetch(request: Request, env: AdminWorkerEnv): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (path.startsWith("/api/")) {
      if (!path.startsWith("/api/v1/admin/"))
        return Response.json(
          { success: false, message: "Not found" },
          { status: 404 },
        );
      const headers = new Headers(request.headers);
      headers.delete("token");
      headers.delete("secret-key");
      return env.API.fetch(new Request(request, { headers }));
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<AdminWorkerEnv>;
