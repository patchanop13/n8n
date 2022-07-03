"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vite_plugin_vue2_1 = require("vite-plugin-vue2");
const path_1 = require("path");
exports.default = {
    plugins: [
        (0, vite_plugin_vue2_1.createVuePlugin)(),
    ],
    resolve: {
        alias: {
            '@': (0, path_1.resolve)(__dirname, 'src'),
            'vue2-boring-avatars': (0, path_1.resolve)(__dirname, '..', '..', 'node_modules', 'vue2-boring-avatars', 'dist', 'vue-2-boring-avatars.umd.js'),
            // 'vue2-boring-avatars': 'vue2-boring-avatars/dist/vue-2-boring-avatars.umd.js',
        },
    },
    build: {
        lib: {
            entry: (0, path_1.resolve)(__dirname, 'src', 'main.js'),
            name: 'N8nDesignSystem',
            fileName: (format) => `n8n-design-system.${format}.js`,
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['vue'],
            output: {
                exports: 'named',
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [
            './src/__tests__/setup.ts',
        ],
    },
};
