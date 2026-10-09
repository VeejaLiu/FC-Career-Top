const redirectWorker = {
  fetch(request: Request, env: RedirectEnv): Response {
    const source = new URL(request.url);
    const destination = new URL(env.CANONICAL_ORIGIN);
    // Assign the path rather than resolving it as a URL, so //example.com paths
    // cannot change the configured destination host.
    destination.pathname = source.pathname;
    destination.search = source.search;
    return Response.redirect(destination.toString(), 301);
  },
};

export default redirectWorker;
