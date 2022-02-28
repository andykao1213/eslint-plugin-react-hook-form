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
        "Use destructuring assignment to access the properties of formState. This ensure the hook has subscribed to the changes of the states.",
      category: "Possible Errors",
      url: "https://github.com/andykao1213/eslint-plugin-react-hook-form/blob/main/docs/rules/destructuring-formstate.md",
    },
    messages: {
      useDestuctor: "Use desturctoring assignment for formState's properties.",
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
            messageId: "useDestuctor",
          });
        }
      });
    }

    function check(node) {
      if (
        node.type === "VariableDeclarator" &&
        node.init?.type === "CallExpression" &&
        node.init?.callee.name === "useForm"
      ) {
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
