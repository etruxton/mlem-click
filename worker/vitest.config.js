import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
    test: {
        poolOptions: {
            workers: {
                wrangler: { configPath: './wrangler.toml', environment: 'test' },
                miniflare: {
                    d1Databases: ['DB'],
                    kvNamespaces: ['MLEM_KV'],
                },
            },
        },
    },
});
