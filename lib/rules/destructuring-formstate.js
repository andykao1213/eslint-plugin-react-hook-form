/**
 * @fileoverview Use destructuring assignment to access the properties of formState. This ensure the hook has subscribed to the changes of the states.
 * @author Andrew Kao
 */
"use strict";

const findPropertyByName = require("../utils/findPropertyByName");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Use destructuring assignment to access the properties of formState. This ensures the hook has subscribed to the state changes. Also checks for fieldState which internally reads formState.",
      category: "Possible Errors",
      url: "https://github.com/andykao1213/eslint-plugin-react-hook-form/blob/main/docs/rules/destructuring-formstate.md",
    },
    messages: {
      useDestructure:
        "Use destructuring assignment for formState's (or fieldState's) properties.",
    },
  },

  create: function(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * @param {string} name
     */
    function checkIsAccessProperties(name) {
      const variable = context.getScope().set.get(name);
      variable.references.forEach((ref) => {
        const { parent } = ref.identifier;
        if (parent.type === "MemberExpression") {
          return context.report({
            node: parent.property,
            messageId: "useDestructure",
          });
        }
      });
    }

    /**
     * @param {import("estree").Node} node
     * @param {string} name
     */
    function checkIsAccessAssignedProperties(node, name) {
      const property = findPropertyByName(node, name);
      // Only looking for {formState} or {formState: alias}
      if (property?.value.type === "Identifier") {
        checkIsAccessProperties(property.value.name);
      }
    }

    /** @param {import("estree").VariableDeclarator} node */
    function check(node) {
      if (
        node.init?.type === "CallExpression" &&
        (node.init?.callee.name === "useForm" ||
          node.init?.callee.name === "useFormContext")
      ) {
        checkIsAccessAssignedProperties(node, "formState");
      } else if (
        node.init?.type === "CallExpression" &&
        node.init?.callee.name === "useController"
      ) {
        checkIsAccessAssignedProperties(node, "formState");
        checkIsAccessAssignedProperties(node, "fieldState");
      } else if (
        node.init?.type === "CallExpression" &&
        node.init?.callee.name === "useFormState" &&
        node.id.type === "Identifier"
      ) {
        checkIsAccessProperties(node.id.name);
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
