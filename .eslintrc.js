module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
    // extraFileExtensions: ["html"],
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/no-unresolved": "off",
    "import/prefer-default-export": "off",
    "no-useless-constructor": "off",
    "import/no-extraneous-dependencies": "off",
    "class-methods-use-this": "off",
  },
  ignorePatterns: [
    "**/*.spec.ts",
    "**/*.html",
    "**/*.js",
    "**/node_modules/**",
  ],
};
