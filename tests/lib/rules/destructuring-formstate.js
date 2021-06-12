/**
 * @fileoverview Use desturcturing assignment to access the properties of formState. This ensure the hook has subscribed to the changes of the states.
 * @author Andrew Kao
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/destructuring-formstate"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("destructuring-formstate", rule, {
  valid: [
    {
      code: `
        function Component() {
          const {formState: {isDirty}} = useFrom();
          console.log(isDirty);
          return null;
        }
    `,
      parserOptions: { ecmaVersion: 6 },
    },
  ],

  invalid: [
    {
      code: `
        function Component() {
          const {formState} = useFrom();
          console.log(formState.isDirty);
          return null;
        }
      `,
      errors: [
        {
          messageId: "useDestuctor",
        },
      ],
      parserOptions: { ecmaVersion: 6 },
    },
  ],
});
