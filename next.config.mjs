/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/default */

import './src/config/env.server.mjs'
import './src/config/env.client.mjs'

import tamagui_next_plugin from '@tamagui/next-plugin'
import { join } from 'node:path'

const { withTamagui } = tamagui_next_plugin

/** @type {import('next').NextConfig} */
let config = {
  // output: 'export',
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // disableStaticImages: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@achingbrain/nat-port-mapper': false,
      }
    }

    return config
  },
  transpilePackages: [
    // 'react-native',
    'react-native-web',
    // 'expo-modules-core',
    'expo-blur',
    '@felicio/icons',
    '@felicio/components',
    '@felicio/js',
    // '@achingbrain/nat-port-mapper',
    // 'js-waku',
    // 'libp2p',
  ],
  experimental: {
    legacyBrowsers: false,
    // todo?: remove; works without it
    esmExternals: 'loose',
    // esmExternals: false,
    // esmExternals: true,
  },
}

const plugins = [
  withTamagui({
    config: './tamagui.config.ts',
    components: [
      // fixme?: works without it
      // '@felicio/icons',
      '@felicio/components',
      // './node_modules/@felicio/components/packages/components/dist',
    ],
    importsWhitelist: ['constants.js', 'colors.js'],
    logTimings: true,
    disableExtraction: true,
    // experiment - reduced bundle size react-native-web
    useReactNativeWebLite: false,
    shouldExtract: path => {
      if (path.includes(join('packages', 'app'))) {
        return true
      }
    },
    excludeReactNativeWebExports: [
      'Switch',
      'ProgressBar',
      'Picker',
      'CheckBox',
      'Touchable',
      'Modal',
    ],
  }),
]

export default () => {
  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  return config
}
