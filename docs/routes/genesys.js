var express = require('express')
    , router = express.Router()
    , platformClient = require('purecloud-platform-client-v2')    
    , openmessaging = require('../genesyscloud/openmessaging')
    , commonVariables = require('../common-variables');

const client = platformClient.ApiClient.instance;

router.route('/')
    .post(function(req, res){
        if(req.body.type == "url_verification")
        {
            if (req.body.token == commonVariables.app_verification_token)
            {
                res.status(200).send({"challenge":req.body.challenge});
            }
            else
            {
                res.status(400).send("Challenge Failed");
            }
        }
        else if (req.body.type == "event_callback")
        {
          client.loginClientCredentialsGrant(commonVariables.clientId, commonVariables.clientSecret).then(()=> {
                if(req.body.event.type == "app_mention")
                {
                    console.log("Received the following App Mention from Slack");
                    console.log(req.body);

                    openmessaging.postAppmentionOpenMessage(client.authData.accessToken, req.body.event.text, req.body.event.client_msg_id, req.body.event.user).then((data) => {
                        res.send(data);
                    })
                    .catch((err) => {
                        res.status(400).send(err);
                    });
                }
                else if(req.body.event.type == "message")
                {
                    console.log("Received the following Direct Message from Slack");
                    console.log(req.body);

                    openmessaging.postDirectOpenMessage(client.authData.accessToken, req.body.event.text, req.body.event.client_msg_id, req.body.event.user).then((data) => {
                        res.send(data);
                    })
                    .catch((err) => {
                        res.status(400).send(err);
                    });
                }
            })
            .catch((err) => {
                res.status(400).send(err);
            });
        }
        else
        {   
            res.status(400).send("Not listening for the chosen event type");
        }
    });

module.exports = router;