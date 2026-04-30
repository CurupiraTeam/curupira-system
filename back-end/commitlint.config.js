// apps/backend/commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-case': [2, 'always', 'lower-case'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-enum': [2, 'always', ['front', 'back', 'repo', 'shared']],
    'scope-empty': [1, 'never'],
    'header-max-length': [2, 'always', 250],
    'body-max-line-length': [0],
    'footer-max-line-length': [0]
  }
};