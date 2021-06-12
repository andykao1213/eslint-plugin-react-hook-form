# eslint-plugin-react-hook-form

[react-hook-form](https://github.com/react-hook-form/react-hook-form) is an awsome library which provide a neat solution for building forms. However, there are many rules for the API which may be missed by the developer. This plugin aims to check those rules automatically thourgh ESLint. Thus brings better DX for react-hook-form.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-react-hook-form`:

```
$ npm install eslint-plugin-react-hook-form --save-dev
```

## Usage

Add `react-hook-form` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["react-hook-form"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "react-hook-form/destructuring-formState": "error"
  }
}
```

## Supported Rules

- [destructuring-formState](docs/rules/destructuring-formstate.md)
