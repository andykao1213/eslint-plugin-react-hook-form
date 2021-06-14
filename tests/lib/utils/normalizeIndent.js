/**
 * A string template tag that removes padding from the left side of multi-line strings.
 * Reference: https://github.com/facebook/react/blob/master/packages/eslint-plugin-react-hooks/__tests__/ESLintRuleExhaustiveDeps-test.js
 * @param {Array} strings array of code strings (only one expected)
 */
function normalizeIndent(strings) {
  const codeLines = strings[0].split("\n");
  const leftPadding = codeLines[1].match(/\s+/)[0];
  return codeLines.map((line) => line.substr(leftPadding.length)).join("\n");
}

module.exports = normalizeIndent;
