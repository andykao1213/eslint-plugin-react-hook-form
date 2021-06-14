# Use destructuring assignment to access the properties of formState. (destructuring-formstate)

This ensures the hook has subscribed to the changes of the states.

## Rule Details

Since the `formState` is wrapped with a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to improve the render performance, it requires to `get` `fomrState`'s properties in the first render. So the component can aware of the state change and renders correctly. We suggest using destructuring assignment to make sure the state has been subscribed.

Examples of **incorrect** code for this rule:

```js
// ❌ formState.isValid is accessed conditionally,
// so the Proxy does not subscribe to changes of that state
return <button disabled={!formState.isDirty || !formState.isValid} />;
```

```js
const formState = useFormState(); // ❌ should deconstruct the formState
formState.isDirty; // ❌ subscription will be one render behind.
```

Examples of **correct** code for this rule:

```jsx
// ✅ read all formState values to subscribe to changes
const { isDirty, isValid } = formState;
return <button disabled={!isDirty || !isValid} />;
```

```js
const { isDirty } = useFormState(); // ✅
```

### Options

NA

## When Not To Use It

If your app is **always** running on the platform which doesn't support Proxy such as React Native or [legacy browsers](https://caniuse.com/proxy).

## Further Reading

[Document of React-Hook-Form - `formState`](https://react-hook-form.com/api/useform/formstate)
[Document of React-Hook-Form - `useFormState`](https://react-hook-form.com/api/useformstate)
