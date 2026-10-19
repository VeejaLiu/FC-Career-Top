const destinations = new Set([
  '/career',
  '/players',
  '/players-detail',
  '/players-trends',
  '/get-started',
  '/settings',
  '/settings/password',
]);

export function loginDestination(
  location: Pick<Location, 'pathname' | 'search' | 'hash'> = window.location,
): string {
  return destinations.has(location.pathname)
    ? `${location.pathname}${location.search}${location.hash}`
    : '/career';
}
