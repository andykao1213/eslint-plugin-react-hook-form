/**
 * @fileoverview Avoid accessing the properties of control
 * @author Andrew Kao
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-access-control"),
  RuleTester = require("eslint").RuleTester;

const normalizeIndent = require("../utils/normalizeIndent");
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 9,
    ecmaFeatures: {
      jsx: true,
    },
  },
});
ruleTester.run("no-access-control", rule, {
  valid: [
    {
      code: normalizeIndent`
        function Component(){
            const {control} = useForm();
            return <Controller control={control} />
        }
      `,
    },
    {
      code: normalizeIndent`
        function Component(){
            const {control: c} = useForm();
            return <Controller control={c} />
        }
    `,
    },
    {
      code: normalizeIndent`
        function Component() {
          const formMethods = useForm();
        }
      `,
    },
    {
      code: normalizeIndent`
        function Component() {
          const {watch, ...restFormMethods} = useFormState();
        }
      `,
    },
  ],
  invalid: [
    {
      code: normalizeIndent`
        function Component(){
            const {control} = useForm();
            console.log(control.defaultValuesRef);
        }
    `,
      errors: [
        {
          messageId: "noAccessControl",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 41,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component(){
            const {control:c} = useForm();
            console.log(c.defaultValuesRef);
        }
      `,
      errors: [
        {
          messageId: "noAccessControl",
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 35,
        },
      ],
    },
  ],
});
