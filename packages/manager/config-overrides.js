const rewireAliases = require('react-app-rewire-aliases');
const { paths } = require('react-app-rewired');
const path = require('path');

/* config-overrides.js */
module.exports = function override(config, env) {
  // allow importing from outside of app/src folder, ModuleScopePlugin prevents this.
  const scope = config.resolve.plugins.findIndex(o => o.constructor.name === 'ModuleScopePlugin');
  if (scope > -1) {
    config.resolve.plugins.splice(scope, 1);
  }

  config = rewireAliases.aliasesOptions({
    '@contracts': path.resolve(__dirname, `${paths.appSrc}/../../build/contracts`)
  })(config, env);

  return config;
};
