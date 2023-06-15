/**
 * @param {import("estree-jsx").JSXOpeningElement} node
 * @param {string} name
 * @returns {import("estree-jsx").JSXAttribute | null}
 */
module.exports = function findJSXAttributeByName(node, name) {
  return node.attributes.find((p) => p.type === 'JSXAttribute' && p.name.name === name);
};
