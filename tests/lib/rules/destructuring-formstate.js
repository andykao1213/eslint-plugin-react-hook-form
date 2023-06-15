/**
 * @fileoverview Use destructuring assignment to access the properties of formState. This ensure the hook has subscribed to the changes of the states.
 * @author Andrew Kao
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/destructuring-formstate"),
  RuleTester = require("eslint").RuleTester;

const normalizeIndent = require("../utils/normalizeIndent");
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 9 } });
ruleTester.run("destructuring-formstate", rule, {
  valid: [
    {
      code: normalizeIndent`
        function Component() {
          const {formState: {isDirty}} = useForm();
          console.log(isDirty);
          return null;
        }
    `,
    },
    {
      code: normalizeIndent`
        function Component() {
          const {formState: {isDirty}, fieldState: {isTouched}} = useController();
          console.log(isDirty);
          console.log(isTouched);
          return null;
        }
      `,
    },
    {
      code: normalizeIndent`
        function Component() {
          const formState = {isDirty: true};
          const fieldState = {isTouched: true};
          console.log(formState.isDirty);
          console.log(fieldState.isTouched);
          return null;
        }
    `,
    },
    {
      code: normalizeIndent`
        function Component() {
          const {isDirty} = useFormState();
          console.log(isDirty);
          return null;
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
    {
      code: normalizeIndent`
        function Component() {
          const {formState: {isDirty}} = useFormContext();
          console.log(isDirty);
          return null;
        }
    `,
    },
    {
      code: normalizeIndent`
        function Component() {
          const formMethods = useFormContext();
        }
      `,
    },
  ],

  invalid: [
    {
      code: normalizeIndent`
        function Component() {
          const {formState, register} = useForm();
          console.log(formState.isDirty);
          console.log(formState.errors);
          return null;
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 32,
        },
        {
          messageId: "useDestructure",
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 31,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          const {formState: fs, register} = useForm();
          console.log(fs.isDirty);
          return null;
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 25,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          const {formState, fieldState} = useController();
          console.log(formState.isDirty);
          console.log(fieldState.isTouched);
          return null;
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 32,
        },
        {
          messageId: "useDestructure",
          line: 5,
          column: 26,
          endLine: 5,
          endColumn: 35,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          const {formState: fs1, fieldState: fs2} = useController();
          console.log(fs1.isDirty);
          console.log(fs2.isTouched);
          return null;
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 26,
        },
        {
          messageId: "useDestructure",
          line: 5,
          column: 19,
          endLine: 5,
          endColumn: 28,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          const formState = useFormState();
          console.log(formState.isDirty);
          return null;
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 32,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          const {formState, register} = useFormContext();
          console.log(formState.isDirty);
          console.log(formState.errors);
          return null;
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 32,
        },
        {
          messageId: "useDestructure",
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 31,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          const {formState: fs, register} = useFormContext();
          console.log(fs.isDirty);
          return null;
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 25,
        },
      ],
    },
  ],
});
