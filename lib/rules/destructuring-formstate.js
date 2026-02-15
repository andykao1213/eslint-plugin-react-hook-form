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

    function check(node) {
      if (
        node.type === "VariableDeclarator" &&
        node.init?.type === "CallExpression" &&
        (node.init?.callee.name === "useForm" ||
          node.init?.callee.name === "useFormContext")
      ) {
        const formStateProperty = findPropertyByName(node, "formState");
        if (formStateProperty?.value.type === "Identifier") {
          // Destructured: const {formState} = useForm()
          checkIsAccessFormStateProperties(formStateProperty.value.name);
        } else if (node.id.type === "Identifier") {
          // Non-destructured: const methods = useForm()
          const hookVar = context.getScope().set.get(node.id.name);
          hookVar.references.forEach((ref) => {
            const { parent } = ref.identifier;
            if (
              parent.type === "MemberExpression" &&
              parent.property.name === "formState" &&
              parent.parent.type === "MemberExpression"
            ) {
              context.report({
                node: parent.parent.property,
                messageId: "useDestructure",
              });
            }
          });
        }
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
