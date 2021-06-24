/**
 * @fileoverview Avoid nested object in second argument of setValue
 * @author Andrew Kao
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-nested-object-setvalue"),
  RuleTester = require("eslint").RuleTester;

const normalizeIndent = require("../utils/normalizeIndent");
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
  },
});
ruleTester.run("no-nested-object-setvalue", rule, {
  valid: [
    {
      code: normalizeIndent`
        const {setValue} = useForm();
        setValue('yourDetails.firstName', 'value');
      `,
    },
    {
      code: normalizeIndent`
        const [value, setValue] = useState();
        setValue('yourDetails', { firstName: 'value' });
      `,
    },
  ],

  invalid: [
    {
      code: normalizeIndent`
        const {setValue} = useForm();
        setValue('yourDetails', { firstName: 'value' });
      `,
      errors: [
        {
          messageId: "noNestedObj",
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 47,
        },
      ],
    },
    {
      code: normalizeIndent`
        const {setValue: s} = useForm();
        s('yourDetails', { firstName: 'value' });
      `,
      errors: [
        {
          messageId: "noNestedObj",
          line: 3,
          column: 18,
          endLine: 3,
          endColumn: 40,
        },
      ],
    },
  ],
});
