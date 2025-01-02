import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const path = require('path');

module.exports = {
    experimental: {
        optimizeCss: true,
    },
    webpack: (config: { resolve: { alias: { [x: string]: any; }; }; }) => {
        config.resolve.alias['@src'] = path.resolve(__dirname, 'src');
        return config;
    },
};

export default nextConfig;
