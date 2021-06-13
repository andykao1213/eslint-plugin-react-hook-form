/**
 * @fileoverview Use desturcturing assignment to access the properties of formState. This ensure the hook has subscribed to the changes of the states.
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
      description:
        "Use desturcturing assignment to access the properties of formState. This ensure the hook has subscribed to the changes of the states.",
      category: "Possible Errors",
      url: "https://react-hook-form.com/api/useform/formstate",
    },
    messages: {
      useDestuctor: "Use desturctoring assignment for formState's properties.",
    },
  },

  create: function (context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function checkforUseForm(node) {
      if (
        node.init.type === "CallExpression" &&
        node.init.callee.name === "useForm"
      ) {
        const formStateProperty = node.id.properties.find(
          (p) => p.key.name === "formState"
        );
        if (formStateProperty?.value.type !== "Identifier") return;
        const formStateName = formStateProperty.value.name;
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
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      VariableDeclarator: checkforUseForm,
    };
  },
};
