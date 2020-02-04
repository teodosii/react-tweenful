const path = require("path");

module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "globals": {
    "process": true
  },
  "settings": {
    "react": {
      version: "16.4.2"
    },
    "import/resolver": {
      alias: {
        map: [
          ["src", path.resolve(__dirname, "src")],
          ["site", path.resolve(__dirname, "site")]
        ],
        extensions: [".js", ".css", ".scss"]
      }
    }
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "env": {
    "es6": true,
    "browser": true,
    "jest": true
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "quotes": "off",
    "linebreak-style": "off",
    "comma-dangle": "off",
    "react/prop-types": "off",
    "react/no-find-dom-node": "off",
    "react/jsx-uses-vars": "error",
    "no-constant-condition": "off",
    "no-console": ["error", {
      allow: ["warn", "error", "trace", "log"]
    }]
  }
}