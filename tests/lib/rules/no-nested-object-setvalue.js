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
    ecmaVersion: 9,
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
    {
      code: normalizeIndent`
        const {setValue} = useForm();
        const myFunc = () => 10
        setValue('yourDetails', myFunc);
      `,
    },
    {
      code: normalizeIndent`
        const {setValue} = useForm();
        const myVar = 10
        setValue('yourDetails', myVar);
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
        const {setValue} = useForm()
        setValue('yourDetails', { firstName: 'value' })
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
      output: normalizeIndent`
        const {setValue} = useForm()
        setValue('yourDetails.firstName', 'value')
      `,
    },
    {
      code: normalizeIndent`
        const {setValue: s} = useForm()
        s('yourDetails', { firstName: 'value' })
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
      output: normalizeIndent`
        const {setValue: s} = useForm()
        s('yourDetails.firstName', 'value')
      `,
    },
    {
      code: normalizeIndent`
        const {setValue} = useForm()
        setValue('field1', { field2: { field4: 'value2', field5: [{field6: 'value3'}, {field6: 4}] }, field3: 'value1' })
      `,
      errors: [
        {
          messageId: "noNestedObj",
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 113,
        },
      ],
      output: normalizeIndent`
        const {setValue} = useForm()
        setValue('field1.field3', 'value1')
        setValue('field1.field2.field4', 'value2')
        setValue('field1.field2.field5.0.field6', 'value3')
        setValue('field1.field2.field5.1.field6', 4)
      `,
    },
    {
      code: normalizeIndent`
        const {setValue} = useForm()
        setValue('field1', { field2: [{field3: 'value1'}, {field3: 'value2'}] })
      `,
      options: [
        {
          bracketAsArrayIndex: true,
        },
      ],
      errors: [
        {
          messageId: "noNestedObj",
          line: 3,
          column: 20,
          endLine: 3,
          endColumn: 72,
        },
      ],
      output: normalizeIndent`
        const {setValue} = useForm()
        setValue('field1.field2[0].field3', 'value1')
        setValue('field1.field2[1].field3', 'value2')
      `,
    },
  ],
});
