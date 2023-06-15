/**
 * @fileoverview Use destructuring assignment to access the properties of formState. This ensure the hook has subscribed to the changes of the states.
 * @author Andrew Kao
 */
"use strict";

const findJSXAttributeByName = require("../utils/findJSXAttributeByName");
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
     * @param {import("estree").Node} scopeNode
     * @param {string} name
     */
    function checkIsAccessProperties(scopeNode, name) {
      // We can use context.sourceCode.getScope(node).set.get(name) in ESLint v8.37.0 or newer.
      const variable = context.getDeclaredVariables(scopeNode).find(v => v.name == name);
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
     * @param {import("estree").Node} scopeNode
     * @param {import("estree").Pattern} node
     * @param {string} name
     */
    function checkIsAccessAssignedProperties(scopeNode, node, name) {
      const property = findPropertyByName(node, name);
      // Only looking for {formState} or {formState: alias}
      if (property?.value.type === "Identifier") {
        checkIsAccessProperties(scopeNode, property.value.name);
      }
    }

    /** @param {import("estree").VariableDeclarator} node */
    function checkHooks(node) {
      if (
        node.init?.type === "CallExpression" &&
        (node.init?.callee.name === "useForm" ||
          node.init?.callee.name === "useFormContext")
      ) {
        checkIsAccessAssignedProperties(node, node.id, "formState");
      } else if (
        node.init?.type === "CallExpression" &&
        node.init?.callee.name === "useController"
      ) {
        checkIsAccessAssignedProperties(node, node.id, "formState");
        checkIsAccessAssignedProperties(node, node.id, "fieldState");
      } else if (
        node.init?.type === "CallExpression" &&
        node.init?.callee.name === "useFormState" &&
        node.id.type === "Identifier"
      ) {
        checkIsAccessProperties(node, node.id.name);
      }
    }

    /** @param {import("estree-jsx").JSXOpeningElement} node */
    function checkJSX(node) {
      if (!(
        node.type === "JSXOpeningElement" &&
        node.name.name === "Controller"
      )) return;

      const renderAttr = findJSXAttributeByName(node, "render");

      if (!(
        renderAttr?.value.type === "JSXExpressionContainer" &&
        (renderAttr?.value.expression.type === "ArrowFunctionExpression" ||
          renderAttr?.value.expression.type === "FunctionExpression")
      )) return

      const renderFunc = renderAttr.value.expression;
      const renderArg = renderFunc.params[0];
      if (!renderArg) return;

      checkIsAccessAssignedProperties(renderFunc, renderArg, "formState");
      checkIsAccessAssignedProperties(renderFunc, renderArg, "fieldState");
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      VariableDeclarator: checkHooks,
      JSXOpeningElement: checkJSX,
    };
  },
};
