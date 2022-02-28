module.exports = function findPropertyByName(node, targetName) {
  return node.id.type === "ObjectPattern"
    ? node.id.properties.find((p) => p.key.name === targetName)
    : null;
};
