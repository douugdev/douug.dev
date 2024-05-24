/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  transpilePackages: ['three'],
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@use "utils/functions.scss" as *;\n@use "utils/mixins.scss" as *;\n@use "theme.scss";`,
  },
};

module.exports = nextConfig;
