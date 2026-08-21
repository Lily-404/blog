const PLACEHOLDER_START = "\uE000"
const PLACEHOLDER_END = "\uE001"

/**
 * Temporarily replace <pre>/<code> segments so `$` inside shell snippets
 * is not treated as KaTeX delimiters.
 */
export function withProtectedCodeSegments(
  html: string,
  transform: (protectedHtml: string) => string
): string {
  const slots: string[] = []

  const protect = (input: string, pattern: RegExp) =>
    input.replace(pattern, (match) => {
      const index = slots.length
      slots.push(match)
      return `${PLACEHOLDER_START}${index}${PLACEHOLDER_END}`
    })

  // Protect pre first so nested <code> inside fences stays intact.
  let protectedHtml = protect(html, /<pre(?:\s[^>]*)?>[\s\S]*?<\/pre>/gi)
  protectedHtml = protect(protectedHtml, /<code(?:\s[^>]*)?>[\s\S]*?<\/code>/gi)

  const transformed = transform(protectedHtml)

  return transformed.replace(
    new RegExp(`${PLACEHOLDER_START}(\\d+)${PLACEHOLDER_END}`, "g"),
    (_, index: string) => slots[Number(index)] ?? ""
  )
}
