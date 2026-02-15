/**
 * @fileoverview Use destructuring assignment to access the properties of formState. This ensure the hook has subscribed to the changes of the states.
 * @author Andrew Kao
 */
"use strict";

const findPropertyByName = require("../utils/findPropertyByName");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Use destructuring assignment to access the properties of formState. This ensures the hook has subscribed to the state changes.",
      category: "Possible Errors",
      url: "https://github.com/andykao1213/eslint-plugin-react-hook-form/blob/main/docs/rules/destructuring-formstate.md",
    },
    messages: {
      useDestructure:
        "Use destructuring assignment for formState's properties.",
    },
  },

  create: function (context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function checkIsAccessFormStateProperties(formStateName) {
      const formStateVar = context.getScope().set.get(formStateName);
      formStateVar.references.forEach((formStateReference) => {
        const { parent } = formStateReference.identifier;
        if (parent.type === "MemberExpression") {
          return context.report({
            node: parent.property,
            messageId: "useDestructure",
          });
        }
      });
    }

    function checkFormStateViaObject(varName) {
      const variable = context.getScope().set.get(varName);
      if (!variable) return;
      variable.references.forEach((ref) => {
        const { parent } = ref.identifier;
        if (
          parent.type === "MemberExpression" &&
          parent.property.name === "formState"
        ) {
          const grandParent = parent.parent;
          if (
            grandParent.type === "MemberExpression"
          ) {
            context.report({
              node: grandParent.property,
              messageId: "useDestructure",
            });
          }
        }
      });
    }

    function check(node) {
      if (
        node.type === "VariableDeclarator" &&
        node.init?.type === "CallExpression" &&
        (node.init?.callee.name === "useForm" ||
          node.init?.callee.name === "useFormContext")
      ) {
        if (node.id.type === "Identifier") {
          checkFormStateViaObject(node.id.name);
          return;
        }
        const formStateProperty = findPropertyByName(node, "formState");
        // Only looking for {formState} or {formState: alias}
        if (formStateProperty?.value.type !== "Identifier") return;
        checkIsAccessFormStateProperties(formStateProperty.value.name);
      } else if (
        node.init?.type === "CallExpression" &&
        node.init?.callee.name === "useFormState" &&
        node.id.type === "Identifier"
      ) {
        checkIsAccessFormStateProperties(node.id.name);
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
