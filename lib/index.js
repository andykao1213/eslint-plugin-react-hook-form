/**
 * @fileoverview ESLint for react-hook-form
 * @author Andrew Kao
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + "/rules");

const plugins = ["react-hook-form"];

module.exports.configs = {
  recommended: {
    plugins,
    rules: {
      "react-hook-form/destructuring-formstate": "error",
      "react-hook-form/no-access-control": "error",
      "react-hook-form/no-nested-object-setvalue": "error",
    },
  },
  "react-compiler": {
    plugins,
    rules: {
      "react-hook-form/no-use-watch": "error",
    },
  },
};
