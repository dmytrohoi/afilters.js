module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "max-classes-per-file": 0,
    "no-console": 0,
  },
};
