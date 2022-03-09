const platformClient = require('purecloud-platform-client-v2')
    , conversationsAPI = new platformClient.ConversationsApi()
    , commonVariables = require('../common-variables');


exports.postAppmentionOpenMessage = (accessToken, message, messageId, user) => {
  return new Promise(function(fulfill, reject) {
    platformClient.ApiClient.instance.setAccessToken(accessToken);

    var d = new Date();

    let body = {
      "channel": {
        "platform": "Open",
        "type": "Private",
        "messageId": messageId, //"<External Service Message ID>"
        "to": {
          "id": commonVariables.open_messaging_app_mention_id //"<Integration ID>"
        },
        "from": {
          "id": user,
          "idType": "Opaque"
        },
        "time": d.toISOString()
      },
      "type": "Text",
      "text": message,
      "direction": "Inbound"
    };

    console.log("Sending the following payload to Genesys Cloud Open Messaging");
    console.log(body);
      
    conversationsAPI.postConversationsMessagesInboundOpen(body).then((data) => {
        console.log("Successfully sent message to Genesys Cloud Open Messaging");

        fulfill(data);
    })
    .catch((err) => {
        console.log(err);
        
        reject({'status':400, 'message':err.message});
    });           
  });
};

exports.postDirectOpenMessage = (accessToken, message, messageId, user) => {
  return new Promise(function(fulfill, reject) {
    platformClient.ApiClient.instance.setAccessToken(accessToken);

    var d = new Date();

    let body = {
      "channel": {
        "platform": "Open",
        "type": "Private",
        "messageId": messageId, //"<External Service Message ID>"
        "to": {
          "id": commonVariables.open_messaging_direct_messaging_id//"<Integration ID>"
        },
        "from": {
          "id": user,
          "idType": "Opaque"
        },
        "time": d.toISOString()
      },
      "type": "Text",
      "text": message,
      "direction": "Inbound"
    };

    console.log("Sending the following payload to Genesys Cloud Open Messaging");
    console.log(body);
      
    conversationsAPI.postConversationsMessagesInboundOpen(body).then((data) => {
        console.log("Successfully sent message to Genesys Cloud Open Messaging");

        fulfill(data);
    })
    .catch((err) => {
        console.log(err);
        
        reject({'status':400, 'message':err.message});
    });           
  });
};