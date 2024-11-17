/**
 * @fileoverview Use useWatch instead of watch. This ensures the hook has subscribed to the state changes when using React Compiler.
 * @author tatsuya.asami
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-use-watch"),
  RuleTester = require("eslint").RuleTester;

const normalizeIndent = require("../utils/normalizeIndent");
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 9 } });
ruleTester.run("no-use-watch", rule, {
  valid: [
    {
      code: normalizeIndent`
        function Component() {
          const {control} = useForm();
          uswWatch(control);
          return null;
        }
    `,
    },
    {
      code: normalizeIndent`
        function Component() {
          const {control} = useFormState();
          uswWatch(control);
          return null;
        }
      `,
    },
    {
      code: normalizeIndent`
        function Component() {
          const watch = 'watch';
          console.log(watch);
          return null;
        }
      `,
    },
  ],

  invalid: [
    {
      code: normalizeIndent`
        function Component() {
          const {watch} = useForm();
          return null;
        }
      `,
      errors: [
        {
          messageId: "useUseWatch",
          line: 3,
          column: 10,
          endLine: 3,
          endColumn: 15,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          const formMethods = useForm();
          console.log(formMethods.watch());
          return null;
        }
      `,
      errors: [
        {
          messageId: "useUseWatch",
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 32,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          const {watch} = useFormContext();
          return null;
        }
      `,
      errors: [
        {
          messageId: "useUseWatch",
          line: 3,
          column: 10,
          endLine: 3,
          endColumn: 15,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          const formContext = useFormContext();
          console.log(formContext.watch());
          return null;
        }
      `,
      errors: [
        {
          messageId: "useUseWatch",
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 32,
        },
      ],
    },
  ],
});
