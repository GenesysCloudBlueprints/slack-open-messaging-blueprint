var express = require('express')
    , router = express.Router()
    , slackapi = require('../slack/slackapi')
    , crypto = require('crypto')
    , commonVariables = require('../common-variables');

router.route('/')
    .post(function(req, res){
        // verify message signature
        if(req.body.type == "Text")
        {
            console.log ("Received the following message from Genesys Cloud Open Messaging:")
            console.log(req.body);
            
            const normalizedMessage = req.body;
            const signature = req.headers['x-hub-signature-256'];
            const messageHash = crypto
                .createHmac('sha256', commonVariables.open_messaging_secret_token)
                .update(JSON.stringify(normalizedMessage))
                .digest('base64');

            if (`sha256=${messageHash}` === signature) {
                console.log('Webhook Validation Succeeded!');     

                //Send as a Direct Message
                if(req.body.channel.id == commonVariables.open_messaging_direct_messaging_id)
                {                    
                    slackapi.postSlackMessageDM(req.body.text, req.body.channel.to.id).then((data) => {
                        res.send(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).send(err);
                    });
                }
                else //Send back to the group that app_mentioned the conversation
                {
                    slackapi.postSlackMessage(req.body.text).then((data) => {
                        res.send(data);
                    })
                    .catch((err) => {
                        res.status(400).send(err);
                    });   
                }
            } else {
                console.log('Webhook Validation Failed!');
                res.status(400).send('Webhook Validation Failed!'); 
            }    
        }
        else
        {
            console.log("Received a message from Open Message, but not listenting for the event type of " + req.body.type);
            res.status(400).send("Not listening for the chosen event type");
        }         
    });

module.exports = router;