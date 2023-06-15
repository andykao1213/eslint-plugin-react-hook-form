/** @param {import("estree").Pattern} node */
module.exports = function findPropertyByName(node, targetName) {
  return node.type === "ObjectPattern"
    ? node.properties.find((p) => p.key.name === targetName)
    : null;
};
