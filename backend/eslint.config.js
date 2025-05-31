import { configApp } from '@adonisjs/eslint-config'
export default configApp({
  rules: {
    // Disable prettier line break enforcement
    'prettier/prettier': 'off',

    // Disable prefer-node-protocol errors
    '@unicorn/prefer-node-protocol': 'off',

    // Disable eqeqeq rule
    'eqeqeq': 'off',
  },
})
