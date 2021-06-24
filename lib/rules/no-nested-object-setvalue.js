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
          const { parent } = setValueReference.identifier;
          if (parent.type === "CallExpression") {
            const secondArgument = parent.arguments[1];
            if (secondArgument && secondArgument.type !== "Literal") {
              return context.report({
                node: secondArgument,
                messageId: "noNestedObj",
              });
            }
          }
        });
      }
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      VariableDeclarator: check,
    };
  },
};
