export function parseApiQueryString(qs: URLSearchParams): {
  query: string
  params: Record<string, unknown>
} {
  const params: Record<string, unknown> = {}
  for (const [key, value] of qs.entries()) {
    if (key[0] === '$') {
      params[key.slice(1)] = JSON.parse(value)
    }
  }

  return {query: qs.get('query') || '', params}
}
