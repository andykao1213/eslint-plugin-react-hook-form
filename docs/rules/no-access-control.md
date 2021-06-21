# Avoid accessing the properties of control (no-access-control)

Do not access any of the properties inside the object `control` directly. It's for internal usage only.

## Rule Details

Examples of **incorrect** code for this rule:

```js
function Component() {
  const { control } = useForm();
  console.log(control.defaultValuesRef);
  // ...
}
```

Examples of **correct** code for this rule:

```js
function Component() {
  const { control } = useForm();
  const { fields } = useFieldArray({ control, name: "test" });
  // ...
}
```

### Options

NA

## When Not To Use It

NA

## Further Reading

[Document of React Hook Form - control](https://react-hook-form.com/api/useform/control)
