import prettier from 'eslint-config-prettier';

export default [
    {
        ignores: ['node_modules/**', '.wrangler/**', '**/.wrangler/**'],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                localStorage: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                Audio: 'readonly',
                FormData: 'readonly',
                fetch: 'readonly',
                console: 'readonly',
                // Cloudflare Workers
                Response: 'readonly',
                URL: 'readonly',
                // Turnstile
                turnstile: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
            'prefer-const': 'error',
            'no-var': 'error',
        },
    },
    prettier,
];
