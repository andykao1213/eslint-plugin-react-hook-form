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
     * @param {import("estree").Pattern} node
     * @param {(scopeNode: import("estree").Node, node: import("estree").Pattern) => void} assignmentCallback
     * @param {(node: import("estree").Node) => void} referenceCallback
     */
    function traverseAliasedVariables(scopeNode, node, assignmentCallback, referenceCallback) {
      assignmentCallback(scopeNode, node);

      // Only check for aliasing (`const foo = bar`), not destructuring
      if (node.type === "Identifier") {
        // Traverse references in scope
        // We can use context.sourceCode.getScope(node).set.get(name) in ESLint v8.37.0 or newer.
        const variable = context.getDeclaredVariables(scopeNode).find(v => v.name == node.name);
        for (const ref of variable.references) {
          if (ref.identifier === node) continue;
          /** @type {import("estree").Node} */
          const parent = ref.identifier.parent;
          if (parent.type === "VariableDeclarator") {
            traverseAliasedVariables(parent, parent.id, assignmentCallback, referenceCallback);
          }
          referenceCallback(parent);
        }
      }
    }

    /**
     * @param {import("estree").MemberExpression} node
     */
    function checkHasMemberAccess(node) {
      if (node.type === "MemberExpression") {
        context.report({
          node: node.property,
          messageId: "useDestructure",
        });
      }
    }

    /**
     * @param {import("estree").Node} scopeNode
     * @param {string} name
     */
    function checkIsAccessProperties(scopeNode, name) {
      // We can use context.sourceCode.getScope(node).set.get(name) in ESLint v8.37.0 or newer.
      const variable = context.getDeclaredVariables(scopeNode).find(v => v.name == name);
      variable.references.forEach((ref) => {
        checkHasMemberAccess(ref.identifier.parent);
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

    /**
     * @param {import("estree").Node} scopeNode
     * @param {import("estree").Pattern} node
     */
    function checkIsAccessAssignedFormProperties(scopeNode, node) {
      checkIsAccessAssignedProperties(scopeNode, node, "formState");
    }

    /**
     * @param {import("estree").Node} scopeNode
     * @param {import("estree").Pattern} node
     */
    function checkIsAccessAssignedControllerProperties(scopeNode, node) {
      checkIsAccessAssignedProperties(scopeNode, node, "formState");
      checkIsAccessAssignedProperties(scopeNode, node, "fieldState");
    }

    function checkIsMemberAccessFormProperties(node) {
      if (node.type === 'MemberExpression' && node.property.type === 'Identifier' && (node.property.name === 'formState')) {
        checkHasMemberAccess(node.parent);
      }
    }

    function checkIsMemberAccessControllerProperties(node) {
      if (node.type === 'MemberExpression' && node.property.type === 'Identifier' && (node.property.name === 'formState')) {
        checkHasMemberAccess(node.parent);
      }
    }

    /** @param {import("estree").VariableDeclarator} node */
    function checkHooks(node) {
      if (node.init?.type !== "CallExpression") return
      if (
        node.init?.callee.name === "useForm" ||
        node.init?.callee.name === "useFormContext"
      ) {
        traverseAliasedVariables(node, node.id, checkIsAccessAssignedFormProperties, checkIsMemberAccessFormProperties);
      } else if (node.init?.callee.name === "useController") {
        traverseAliasedVariables(node, node.id, checkIsAccessAssignedControllerProperties, checkIsMemberAccessControllerProperties);
      } else if (
        node.init?.callee.name === "useFormState" &&
        node.id.type === "Identifier"
      ) {
        traverseAliasedVariables(node, node.id, () => { }, checkHasMemberAccess);
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

      traverseAliasedVariables(renderFunc, renderArg, checkIsAccessAssignedControllerProperties, checkIsMemberAccessControllerProperties);
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
