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

#### `bracketAsArrayIndex`

- type: boolean
- default: false
  In V7, the path of index doesn't contain bracket(e.g. `fields.0.value`). However, bracket is required in V6 (`fields[0].value`). This option let user config whether to add bracket for an array index while applying the fix.

## When Not To Use It

NA

## Further Reading

[Document of React Hook Form - setValue](https://react-hook-form.com/api/useform/setvalue)
