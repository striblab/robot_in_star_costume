require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser');
const jokes = require('./lib/jokes.js')
const request = require("request");
const PORT = 3000;

const app = express()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.sendReply = function(reply_text) {
  if (reply_text) {
    var data = {form: {
        token: process.env.SLACK_AUTH_TOKEN,
        channel: "#robot-dojo",
        text: reply_text
      }};
    request.post('https://slack.com/api/chat.postMessage', data, function (error, response, body) {
        // console.log(response);
    });
    return true;
  }
  return false;
}

app.post('/', (req, res) => {
  // console.log(req)

  let payload = req.body;
  let response_text = null;

  if (payload.type == "url_verification") {

    // console.log(timestamp);
    res.send({
      'challenge': payload.challenge
    })

  } else {
    res.sendStatus(200);

    if (payload.event.type === "app_mention") {

      if (payload.event.text.toLowerCase().includes("tell me a joke")) {
        app.sendReply(jokes.tell_a_new_joke(payload.event));
      }
      if (payload.event.text.toLowerCase().match(/knock.*knock/g)) {
        app.sendReply(jokes.respond_to_new_joke(payload.event));
      }

    } else if (payload.event.type === "message") {
      // console.log(payload.event.subtype);
      if (payload.event.subtype != 'bot_message') {
        // console.log(`Received a message event: user ${event.username} in channel ${event.channel} says ${event.text}`);

        app.sendReply(jokes.are_they_joking(payload.event));

        app.sendReply(jokes.am_i_joking(payload.event));

      }
    }
  }
});

// Starts server
app.listen(process.env.PORT || PORT, function() {
  console.log('Bot is listening on port ' + PORT);
});
