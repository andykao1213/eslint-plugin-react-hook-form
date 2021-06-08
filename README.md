# eslint-plugin-react-hook-form

This ESlint plugin check if there is any issue with your [react-hook-form](https://github.com/react-hook-form/react-hook-form).

## Installation

Assuming you already have ESLint installed, run:

```bash
# npm
npm install eslint-plugin-react-hook-form --save-dev

# yarn
yarn add eslint-plugin-react-hook-form --dev
```

Then add the rules to the eslint config:

```js
{
    "plugins": [
        // ...
        "eslint-plugin-react-hook-form"
    ],
    "rules": {
        // ...
        "react-hook-form/destructuring-formState": "error"
    }
}
```

## The problem

[react-hook-form](https://github.com/react-hook-form/react-hook-form) is an awsome library which provide a neat solution for building forms. However, there are many rules for the API which may be missed by the developer. This plugin aims to check those rules automatically thourgh ESLint. Thus brings better DX for react-hook-form.

## Supported Rules

### Possible Errors

| Rule Name               |                      Description                       |
| ----------------------- | :----------------------------------------------------: |
| destructuring-formState | enforce the properties of formState being destructored |
