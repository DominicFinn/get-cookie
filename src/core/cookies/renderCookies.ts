import { groupBy } from "lodash";

import type { RenderOptions } from "../../types/CookieRender";
import type { ExportedCookie } from "../../types/ExportedCookie";

/**
 * Renders cookies as a string or array of strings based on the provided format option.
 * Supports merged format for single string output or grouped format for file-based grouping.
 *
 * @param cookies - The cookies to render
 * @param options - Options for rendering
 * @returns A string for merged format, or array of strings for grouped format
 *
 * @example Merged format (default)
 * ```ts
 * const cookies = [
 *   { value: 'sessionId=abc123' },
 *   { value: 'theme=dark' }
 * ];
 * renderCookies(cookies);
 * // Returns: "sessionId=abc123; theme=dark"
 * ```
 *
 * @example Grouped format with file paths
 * ```ts
 * const cookies = [
 *   { value: 'sessionId=abc123', meta: { file: 'auth.ts' } },
 *   { value: 'theme=dark', meta: { file: 'preferences.ts' } }
 * ];
 * renderCookies(cookies, { format: 'grouped', showFilePaths: true });
 * // Returns: ["auth.ts: sessionId=abc123", "preferences.ts: theme=dark"]
 * ```
 *
 * @example Empty cookies handling
 * ```ts
 * renderCookies([], { format: 'merged' }); // Returns: ""
 * renderCookies([], { format: 'grouped' }); // Returns: []
 * ```
 */
export function renderCookies(
  cookies: ExportedCookie[],
  options: RenderOptions = {},
): string | string[] {
  const { format = "merged", showFilePaths = true, separator = "; " } = options;

  if (cookies.length === 0) {
    return format === "merged" ? "" : [];
  }

  if (format === "merged") {
    return cookies.map((c) => c.value).join(separator);
  }

  const groupedByFile = groupBy(cookies, (c) => c.meta?.file ?? "unknown");
  return Object.entries(groupedByFile).map(([file, fileCookies]) => {
    const values = fileCookies.map((c) => c.value).join(separator);
    return showFilePaths ? `${file}: ${values}` : values;
  });
}
