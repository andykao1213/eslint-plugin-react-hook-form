/**
 * @fileoverview Avoid nested object in second argument of setValue
 * @author Andrew Kao
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Avoid nested object in second argument of setValue",
      category: "Best Practices",
      url: "https://github.com/andykao1213/eslint-plugin-react-hook-form/blob/main/docs/rules/no-nested-object-setvalue.md",
    },
    fixable: "code",
    messages: {
      noNestedObj:
        "Avoid passing object or array as second argument in setValue since this is less performant",
    },
  },

  create: function (context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function check(node) {
      if (
        node.init.type === "CallExpression" &&
        node.init.callee.name === "useForm"
      ) {
        const setValueProperty = node.id.properties.find(
          (p) => p.key.name === "setValue"
        );
        // Only looking for {setValue} or {setValue: alias}
        if (setValueProperty?.value.type !== "Identifier") return;
        const setValueVar = context
          .getScope()
          .set.get(setValueProperty.value.name);
        setValueVar.references.forEach((setValueReference) => {
          if (setValueReference.identifier.parent.type === "CallExpression") {
            const { parent: setValueCallExpression } =
              setValueReference.identifier;
            const secondArgument = setValueCallExpression.arguments[1];
            if (secondArgument && secondArgument.type !== "Literal") {
              return context.report({
                node: secondArgument,
                messageId: "noNestedObj",
                fix: (fixer) => fix(fixer, setValueCallExpression),
              });
            }
          }
        });
      }
    }

    function fix(fixer, setValueCallExpression) {
      const fixTexts = [];
      const stack = [
        {
          path: setValueCallExpression.arguments[0].value,
          node: setValueCallExpression.arguments[1],
        },
      ];
      while (stack.length) {
        const { path: currentPath, node: currentNode } = stack.shift();
        switch (currentNode.type) {
          case "Literal":
            fixTexts.push(
              `${setValueCallExpression.callee.name}('${currentPath}', ${currentNode.raw})`
            );
            break;
          case "ObjectExpression":
            currentNode.properties.forEach((prop) => {
              stack.push({
                path: `${currentPath}.${prop.key.name}`,
                node: prop.value,
              });
            });
            break;
          case "ArrayExpression":
            currentNode.elements.forEach((ele, idx) => {
              stack.push({
                path: `${currentPath}.${idx}`,
                node: ele,
              });
            });
            break;
          default:
            break;
        }
      }
      return fixer.replaceText(setValueCallExpression, fixTexts.join("\n"));
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      VariableDeclarator: check,
    };
  },
};
