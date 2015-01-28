/**
 * Module dependencies.
 */
var request = require('request');
var program = require('commander');

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
    apiKey: program.apiKey,
    appId: program.appId || defaults.appId,
    appName: program.appName || defaults.appName,
    desc: program.desc || defaults.desc,
    rev: program.rev || defaults.rev,
    changeLog: program.changeLog || defaults.changeLog,
    user: program.user || defaults.user
  };

  console.log('Deployment notification created with the following parameters:');
  console.log('API Key: ', params.apiKey);
  console.log('App ID: ', params.appId);
  console.log('App Name: ', params.appName);
  console.log('Deployment description: ', params.desc);
  console.log('Deployment revision: ', params.rev);
  console.log('Deployment change log: ', params.changeLog);
  console.log('Deployment user: ', params.user);
  console.log('Proxy server: ', params.proxy ? params.proxy : 'No');

  var options = {
    url: defaults.nrUrl,
    proxy: params.proxy,
    method: 'POST',
    form: {
      'deployment[app_name]': params.appName,
      'deployment[application_id]': params.appId,
      'deployment[description]': params.desc,
      'deployment[revision]': params.rev,
      'deployment[changelog]': params.changeLog,
      'deployment[user]': params.user
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-api-key': params.apiKey
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode === 201) {
      console.log('Deployment notification sent successfully!');
      process.exit(0);
    } else {
      console.log('Deployment notification failed:');
      console.log('Error: ', error);
      console.log('Response Status Code: ', response.statusCode);
      console.log('Response Headers: ', response.headers);
      console.log('Body: ', body);

      if (program.v) {
        console.log(response);
      }

      process.exit(1);
    }
  });
}