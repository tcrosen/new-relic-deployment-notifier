var request = require('request');

module.exports = function(params, done) {
  console.log('Deployment notification created with the following parameters:');
  console.log('  API Key: ', params.apiKey);
  console.log('  App ID: ', params.appId);
  console.log('  App Name: ', params.appName);
  console.log('  Description: ', params.desc);
  console.log('  Revision: ', params.rev);
  console.log('  Change log: ', params.changeLog);
  console.log('  User: ', params.user);
  console.log('  Proxy server: ', params.proxy ? params.proxy : 'No');

  var options = {
    url: params.nrUrl,
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
      done(null, response, body);
    } else {
      console.log('Deployment notification failed:');
      console.log('Error: ', error);
      console.log('Response Status Code: ', response.statusCode);
      console.log('Response Headers: ', response.headers);
      console.log('Body: ', body);

      done(error, response, body);
    }
  });
}