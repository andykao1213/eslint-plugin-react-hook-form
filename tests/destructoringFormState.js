const rule = require("../destructoringFormState");
const { RuleTester } = require("eslint");

const ruleTester = new RuleTester();
ruleTester.run("destructuring-formState", rule, {
  valid: [],
  invalid: [
    {
      code: "function App() { const { formState } = useForm(); console.log(formState.isDirty); return null;}",
      parserOptions: { ecmaVersion: 6 },
      errors: [{ messageId: "useDestuctor" }],
    },
  ],
});
