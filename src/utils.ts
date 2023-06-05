export function hasQueryParam(
  queryName: string,
  queryValue: string | 'true' = 'true'
) {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(queryName) === queryValue
}
