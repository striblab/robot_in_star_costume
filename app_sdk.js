require('dotenv').config();

const jokes = require('./lib/jokes.js')
const request = require("request");

// Initialize using signing secret from environment variables
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const port = process.env.PORT || 3000;

sendReply = function(reply_text) {
  var data = {form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#robot-dojo",
      text: reply_text
    }};
  request.post('https://slack.com/api/chat.postMessage', data, function (error, response, body) {
      // console.log(response);
  });
}

slackEvents.on('app_mention', (event)=> {
  if (event.text.toLowerCase().includes("tell me a joke")) {
    jokes.tell_a_new_joke(event);
  }
  if (event.text.toLowerCase().match(/knock.*knock/g)) {
    jokes.respond_to_new_joke(event);
  }
});

slackEvents.on('message', (event) => {
  // Make sure this isn't a mention the bot sent or you'll loop all over the place
  if (event.subtype != 'bot_message') {
    // console.log(`Received a message event: user ${event.username} in channel ${event.channel} says ${event.text}`);

    let bool_incoming_joke = jokes.are_they_joking(event);
    let bool_outgoing_joke = jokes.am_i_joking(event);

    if (bool_incoming_joke === false && bool_outgoing_joke === false) {
      // console.log('Some other type of message, including an app mention.');
    }
  }
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

// Start a basic HTTP server
slackEvents.start(port).then(() => {
  // Listening on path '/slack/events' by default
  console.log(`server listening on port ${port}`);
});
