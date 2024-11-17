# Not use watch method. (no-use-watch)

This ensures the hook has subscribed to the changes of the states when you use React Compiler.

## Rule Details

Since using useMemo with `watch` will cause results to be stale when you use React Compiler. This is part of a pattern, where non-hook APIs should always be memoizable.

Examples of **incorrect** code for this rule:

```jsx
// ❌ should not use watch.
const { watch } = useForm();
```

```jsx
// ❌ should not use watch.
const { watch } = useFormContext();
```

Examples of **correct** code for this rule:

```jsx
// ✅ Use useWatch instead of watch
const { control } = useForm();
const watchedValues = useWatch({ control });
```

```jsx
// ✅ Use useWatch instead of watch
const { control } = useFormContext();
const watchedValues = useWatch({ control });
```

### Options

NA

## When Not To Use It

NA

## Further Reading

[issue: Watch don't work with React Compiler (React 19) ](https://github.com/react-hook-form/react-hook-form/issues/11910)
