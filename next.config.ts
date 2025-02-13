import { NextConfig } from 'next';
import path from 'path';
import { Configuration } from 'webpack';

const nextConfig: NextConfig = {
    experimental: {
        optimizeCss: true,
    },
    webpack: (config: Configuration) => {
        // Ensure 'resolve' and 'alias' are defined
        if (config.resolve) {
            if (!config.resolve.alias) {
                config.resolve.alias = {}; // Initialize 'alias' if it is undefined
            }

            // Type assertion to ensure 'alias' is treated as an object of string keys and string values
            (config.resolve.alias as { [key: string]: string })['@src'] = path.resolve(__dirname, 'src');
        }
        return config;
    },
};

export default nextConfig;
