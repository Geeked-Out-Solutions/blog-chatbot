var apiai = require('apiai');
 
var app = apiai("your_api_key_here");


exports.mattermostHook = (req, res) => {
  // Example input: {"username": "webhook-bot", "text": "Hello, this is a test", "type": "custom_type_here"}
  if (req.body.text === undefined) {
    // This is an error case, as "message" is required.
    res.status(400).send('No message defined!');
  } else {
    // Everything is okay.
    console.log(req.body.text);
    console.log(req.body)
    user = req.body.user_name
    var channel = req.body.channel_name
    console.log("The user is: " + user)
    var request = require('request');
	
    var api_request = app.textRequest(req.body.text, {
        sessionId: 'anythingHere123'
    });

    api_request.on('response', function(response) {
        console.log("This is the response from dialogflow: ", response);
        console.log("This is the result output: ", response.result)
        var text_response = response.result.fulfillment.speech
        console.log("This is our channel: " + channel)
        console.log("This would be our response: " + text_response)
        
        // make the request
        var options = {
          uri: 'your_incoming_webhook_here',
          method: 'POST',
          json: {
            "channel":  channel,
            "text": text_response, 
            "username": "username_of_bot_user",
            "icon_url": "web_url_for_bot_avatar"
          }
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //here put what you want to do with the request
              console.log(response.body)
            }
        })
        
    });

    api_request.on('error', function(error) {
        console.log(error);
    });

    api_request.end();
