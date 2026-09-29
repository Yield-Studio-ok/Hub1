export interface ParsedEnvVar {
  key: string;
  value: string;
  env?: string;
}

/**
 * Parses raw .env file contents into an array of key-value pairs.
 * - Ignores empty lines and comments (# ...)
 * - Strips optional 'export ' prefix
 * - Trims whitespace around keys and unquoted values
 * - Handles single and double-quoted values (stripping surrounding quotes)
 * - Retains '=' within values
 * - Handles trailing inline comments on unquoted and quoted values
 */
export function parseEnvFile(content: string, defaultEnv?: string): ParsedEnvVar[] {
  if (!content || typeof content !== "string") {
    return [];
  }

  const lines = content.split(/\r?\n/);
  const result: ParsedEnvVar[] = [];

  for (let rawLine of lines) {
    let line = rawLine.trim();

    // Ignore empty lines and lines starting with comment symbol
    if (!line || line.startsWith("#")) {
      continue;
    }

    // Support 'export KEY=value' syntax
    if (line.startsWith("export ")) {
      line = line.slice(7).trim();
    }

    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) {
      continue;
    }

    const key = line.slice(0, eqIndex).trim();
    if (!key) {
      continue;
    }

    let rawValue = line.slice(eqIndex + 1).trim();
    let value = "";

    if (rawValue.startsWith('"')) {
      // Double quoted value
      const closingIdx = rawValue.indexOf('"', 1);
      if (closingIdx !== -1) {
        value = rawValue.slice(1, closingIdx);
      } else {
        // Unclosed quote: strip first quote
        value = rawValue.slice(1);
      }
    } else if (rawValue.startsWith("'")) {
      // Single quoted value
      const closingIdx = rawValue.indexOf("'", 1);
      if (closingIdx !== -1) {
        value = rawValue.slice(1, closingIdx);
      } else {
        value = rawValue.slice(1);
      }
    } else {
      // Unquoted: strip trailing inline comments separated by whitespace + #
      const commentIndex = rawValue.search(/\s+#/);
      if (commentIndex !== -1) {
        value = rawValue.slice(0, commentIndex).trim();
      } else {
        value = rawValue;
      }
    }

    result.push({
      key,
      value,
      ...(defaultEnv ? { env: defaultEnv } : {}),
    });
  }

  return result;
}
