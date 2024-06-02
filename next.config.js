/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  transpilePackages: ['three'],
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@use "utils/theme_internal.scss" as *;`,
  },
};

module.exports = nextConfig;
