# Avoid nested object in second argument of setValue (no-nested-object-setvalue)

It's more performant to target the field's name rather than make the second argument a nested object in `setValue`

## Rule Details

Examples of **incorrect** code for this rule:

```js
setValue("yourDetails", { firstName: "value" });
```

Examples of **correct** code for this rule:

```js
setValue("yourDetails.firstName", "value");
```

### Options

NA

## When Not To Use It

NA

## Further Reading

[Document of React Hook Form - setValue](https://react-hook-form.com/api/useform/setvalue)
