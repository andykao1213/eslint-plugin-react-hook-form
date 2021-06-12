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

    function checkFormStateObject(node) {
      if (node.object.name === "formState") {
        return context.report({
          node: node.property,
          messageId: "useDestuctor",
        });
      }
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      MemberExpression: checkFormStateObject,
    };
  },
};
