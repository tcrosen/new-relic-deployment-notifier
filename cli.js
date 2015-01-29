#!/usr/bin/env node

var program = require('commander');
var notify = require('./index');

var defaults = {
  nrUrl: 'http://rpm.newrelic.com/deployments.xml',
  appId: null,
  apiKey: null,
  proxy: null,
  desc: '',
  rev: '',
  changeLog: '',
  user: null,
  appName: null
};

program
  .version('0.0.1')
  .option('-k, --api-key <value>', 'New Relic API key')
  .option('-i, --app-id [value]', 'New Relic application ID')
  .option('-n, --app-name [value]', 'New Relic application name')
  .option('-d, --desc [value]', 'Text annotation for the deployment — notes for you')
  .option('-r, --rev [value]', 'The revision number from your source control system')
  .option('-c, --change-log [value]', 'A list of changes for this deployment')
  .option('-u, --user [value]', 'The name of the user/process that triggered this deployment')
  .option('-p, --proxy [value]', 'Optional proxy server URL to send HTTP request through')
  .option('-v, --verbose', 'Enable verbose logging')
  .parse(process.argv);

if (!program.apiKey) {
  throw Error('An API key (-k) is required');
} else if (!program.appId && !program.appName) {
  throw Error('An app ID (-i) or app name (-n) is required');
} else {

  var params = {
    nrUrl: defaults.nrUrl,
    apiKey: program.apiKey,
    appId: program.appId || defaults.appId,
    appName: program.appName || defaults.appName,
    desc: program.desc || defaults.desc,
    rev: program.rev || defaults.rev,
    changeLog: program.changeLog || defaults.changeLog,
    user: program.user || defaults.user,
    proxy: program.proxy
  };

  notify(params, function(err) {
    if (err) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
}