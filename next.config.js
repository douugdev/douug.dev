/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['three'],
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@use "utils/theme_internal.scss" as *;@use "utils/theme.scss" as *;\n@use "utils/include_media.scss" as *;\n`,
  },
};

module.exports = nextConfig;
