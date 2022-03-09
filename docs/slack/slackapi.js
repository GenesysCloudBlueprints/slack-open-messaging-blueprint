const https = require('https')
  , commonVariables = require('../common-variables');


exports.postSlackMessage = (message) => {
  return new Promise(function(fulfill, reject) {
    var body = { 
      channel: commonVariables.slack_app_mention_channel,
      text: message
    };
  
    var chunks = "";
    var bodyJSON = JSON.stringify(body);

    var postRequest = {
      host: "slack.com",
      path: "/api/chat.postMessage",
      port: 443,
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyJSON),
          'Authorization': "Bearer " + commonVariables.slack_bearer_token
      },
      json: true
    };
    console.log("Sending a message to Slack Platform");
    console.log(postRequest);        

    var req = https.request(postRequest, function(res) {
      console.log('Status: ' + res.statusCode);
      res.setEncoding('utf8');

      res.on('data', function(data) {
          chunks += data.toString();
      }).on('end', function() {
          let slackResponse = JSON.parse(chunks);
          console.log("Successfully sent the message to Slack Platform");
          console.log(slackResponse);

          fulfill(slackResponse)         
      });
    });

    req.on('error', function(e) {
        console.log('Failed to send message to Slack: ' + e);
        reject (e);
    });

    // write data to request body
    req.write(bodyJSON);
    req.end();        
  });
};

exports.postSlackMessageDM = (message, user) => {
  return new Promise(function(fulfill, reject) {
    var body = { 
      channel: user,
      text: message
    };
  
    var chunks = "";
    var bodyJSON = JSON.stringify(body);

    var postRequest = {
      host: "slack.com",
      path: "/api/chat.postMessage",
      port: 443,
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyJSON),
          'Authorization': "Bearer " + commonVariables.slack_bearer_token
      },
      json: true
    };
    console.log("Sending a message to Slack Platform");
    console.log(postRequest);        

    var req = https.request(postRequest, function(res) {
      console.log('Status: ' + res.statusCode);
      res.setEncoding('utf8');

      res.on('data', function(data) {
          chunks += data.toString();
      }).on('end', function() {
          let slackResponse = JSON.parse(chunks);
          console.log("Successfully sent the message to Slack Platform");
          console.log(slackResponse);

          fulfill(slackResponse)
      });
    });

    req.on('error', function(e) {
        console.log('Failed to send message to Slack: ' + e);
        reject (e);
    });

    // write data to request body
    req.write(bodyJSON);
    req.end();        
  });
};