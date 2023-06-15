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

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 9,
    ecmaFeatures: {
      jsx: true
    },
  },
});
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
    {
      // We do not examine the object being spread, but at least it should not cause an error.
      code: normalizeIndent`
        function Component() {
          return (
            <Controller
              {...{render: ({formState, fieldState}) => (
                <span>{formState.isDirty}{fieldState.isTouched}</span>
              )}}
            />
          )
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
          const form = useForm();
          const {formState, register} = form;
          console.log(formState.isDirty);
          console.log(formState.errors);
          if (foo) {
            console.log(formState.isDirty);
            for (const bar of baz) {
              console.log(formState.isDirty);
              class Foo {
                bar() {
                  console.log(formState.isDirty);
                }
              }
            }
          }
          return null;
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 32,
        },
        {
          messageId: "useDestructure",
          line: 6,
          column: 25,
          endLine: 6,
          endColumn: 31,
        },
        {
          messageId: "useDestructure",
          line: 8,
          column: 27,
          endLine: 8,
          endColumn: 34,
        },
        {
          messageId: "useDestructure",
          line: 10,
          column: 29,
          endLine: 10,
          endColumn: 36,
        },
        {
          messageId: "useDestructure",
          line: 13,
          column: 33,
          endLine: 13,
          endColumn: 40,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          const form = useForm();
          console.log(form.formState.isDirty);
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 4,
          column: 30,
          endLine: 4,
          endColumn: 37,
        },
      ]
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
          const controller = useController();
          const {formState, fieldState} = controller;
          console.log(formState.isDirty);
          console.log(fieldState.isTouched);
          return null;
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 32,
        },
        {
          messageId: "useDestructure",
          line: 6,
          column: 26,
          endLine: 6,
          endColumn: 35,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          return (
            <Controller
              render={({formState, fieldState}) => (
                <span>{formState.isDirty}{fieldState.isTouched}</span>
              )}
            />
          )
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 6,
          column: 26,
          endLine: 6,
          endColumn: 33,
        },
        {
          messageId: "useDestructure",
          line: 6,
          column: 46,
          endLine: 6,
          endColumn: 55,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          return (
            <Controller
              render={({formState: fs1, fieldState: fs2}) => (
                <span>{fs1.isDirty}{fs2.isTouched}</span>
              )}
            />
          )
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 6,
          column: 20,
          endLine: 6,
          endColumn: 27,
        },
        {
          messageId: "useDestructure",
          line: 6,
          column: 33,
          endLine: 6,
          endColumn: 42,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          return (
            <Controller
              render={function({formState, fieldState}) {
                return <span>{formState.isDirty}{fieldState.isTouched}</span>
              }}
            />
          )
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 6,
          column: 33,
          endLine: 6,
          endColumn: 40,
        },
        {
          messageId: "useDestructure",
          line: 6,
          column: 53,
          endLine: 6,
          endColumn: 62,
        },
      ],
    },
    {
      code: normalizeIndent`
        function Component() {
          return (
            <Controller
              render={controller => {
                const {formState, fieldState} = controller;
                return <span>{formState.isDirty}{fieldState.isTouched}</span>
              }}
            />
          )
        }
      `,
      errors: [
        {
          messageId: "useDestructure",
          line: 7,
          column: 33,
          endLine: 7,
          endColumn: 40,
        },
        {
          messageId: "useDestructure",
          line: 7,
          column: 53,
          endLine: 7,
          endColumn: 62,
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
