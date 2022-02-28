/**
 * @fileoverview Avoid accessing the properties of control
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
      description: "Avoid accessing the properties of control",
      category: "Best Practices",
      url: "https://github.com/andykao1213/eslint-plugin-react-hook-form/blob/main/docs/rules/no-access-control.md",
    },
    messages: {
      noAccessControl:
        "Do not access the properties of `control`. They're for internal usage.",
    },
  },

  create: function (context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function check(node) {
      if (
        node.type === "VariableDeclarator" &&
        node.init?.type === "CallExpression" &&
        node.init?.callee.name === "useForm"
      ) {
        const controlProperty = findPropertyByName(node, "control");
        // Only looking for {control} or {control: alias}
        if (controlProperty?.value.type !== "Identifier") return;
        const controlVar = context
          .getScope()
          .set.get(controlProperty.value.name);
        controlVar.references.forEach((controlReference) => {
          const { parent } = controlReference.identifier;
          if (parent.type === "MemberExpression") {
            return context.report({
              node: parent.property,
              messageId: "noAccessControl",
            });
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
