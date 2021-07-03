# eslint-plugin-react-hook-form

[![npm version](https://img.shields.io/npm/v/eslint-plugin-react-hook-form?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-react-hook-form)
[![GitHub](https://img.shields.io/github/license/andykao1213/eslint-plugin-react-hook-form?style=flat-square)](LICENSE)

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

or start with the recommended rule set:

```json
{
  "extends": "plugin:react-hook-form/recommended"
}
```

## Supported Rules

| Rule                                                                 | Description                                                           | Recommended | Fixable |
| -------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------- | ------- |
| [destructuring-formState](docs/rules/destructuring-formstate.md)     | Use destructuring assignment to access the properties of `formState`. | ⛔️         |         |
| [no-access-control](docs/rules/no-access-control.md)                 | Avoid accessing the properties of `control`                           | ⛔️         |         |
| [no-nested-object-setvalue](docs/rules/no-nested-object-setvalue.md) | Avoid nested object in second argument of `setValue`                  | ⛔️         | 🔧      |

### Key

| Icon | Description                                     |
| ---- | ----------------------------------------------- |
| ⛔️  | Reports as error in recommended configuration   |
| ⚠️   | Reports as warning in recommended configuration |
| 🔧   | Rule is fixable with `eslint --fix`             |

## License

[MIT](LICENSE)
