const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// Force resolution of React and React Native from mobile's node_modules only
const mobileNodeModules = path.resolve(projectRoot, 'node_modules');

config.resolver.nodeModulesPaths = [
  mobileNodeModules,
  path.resolve(monorepoRoot, 'node_modules'),
];

// Block React from being resolved from root node_modules
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force react and react-native to resolve from mobile's node_modules
  if (
    moduleName === 'react' ||
    moduleName === 'react-native' ||
    moduleName.startsWith('react-native/')
  ) {
    return context.resolveRequest(
      {
        ...context,
        originModulePath: path.join(mobileNodeModules, 'react', 'index.js'),
      },
      moduleName,
      platform
    );
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
