module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
    extends: [
        'airbnb-typescript',
        'airbnb/hooks',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/react',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    env: {
        browser: true,
        jasmine: true,
        jest: true,
        node: true,
    },
    // Airbnb's ESLint config requires this
    parserOptions: {
        project: './tsconfig.json',
    },
    rules: {
        // Include .prettierrc.js rules
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        // We will use TypeScript's types for component props instead
        'react/prop-types': 'off',
        // We don't want unused vars
        '@typescript-eslint/no-unused-vars': ['warn'],
        '@typescript-eslint/ban-types': "warn",
        'import/no-cycle': 'warn',
        'react/jsx-props-no-spreading': "off",
        "@typescript-eslint/explicit-function-return-type": [
            "error",
            {
              "allowExpressions": true
            }
        ],
        "import/prefer-default-export": 0,
        "camelcase": ["off", {"properties": "never"}],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
    },
};
