// Stuff for tracking a joke that a user is telling to the robot
exports.persistent_joke_teller = null;
exports.incoming_joke_step = 0;

// Stuff for randomizing the joke that the bot is telling
exports.current_outgoing_joke = null;

exports.tell_a_new_joke = function(event) {
  // sendReply(`Hello <@${event.user}>! Knock, knock...`);
  return `Hello <@${event.user}>! Knock, knock...`;
}

exports.respond_to_new_joke = function(event) {
  // sendReply(`Hello <@${event.user}>! Who's there?`);
  exports.persistent_joke_teller = event.user
  return `Hello <@${event.user}>! Who's there?`;
}

exports.are_they_joking = function(event) {
  // Option 1: User tells the bot a joke
  if (exports.persistent_joke_teller && event.user == exports.persistent_joke_teller) {
    let joke_responses = [
      'Aha ha ha ha. Ha ha ha ha ha!',
      'LOL',
      "OMG you did not. That's hilarious.",
      `You are a true original, <@${event.user}>!`,
      "Dying. On the floor about to pass out because I am laughing so hard."
    ]

    if (exports.incoming_joke_step == 0) {
      // sendReply(`${event.text} who?`);
      exports.incoming_joke_step++;
      return `${event.text} who?`
    } else {
      // Send a random response from an array
      //sendReply(joke_responses[Math.floor(Math.random()*joke_responses.length)]);
      exports.incoming_joke_step = 0;
      exports.persistent_joke_teller = null;
      return joke_responses[Math.floor(Math.random()*joke_responses.length)];
    }
    // return true;
  }
  return false;
}

exports.am_i_joking = function(event) {
  // Option 2: The bot tells a joke
  let jokes_the_bot_knows = [
    ['Doctor', 'Oooooo wee ooooooooooooo!'],
    ['A bot user', 'A bot user who likes you and just wants you to be happy.'],
    ['Hatch', 'Gesundheit.'],
    ['Mustache', 'I mustache you to get back to work.'],
    ['Aida', 'Aida a sandwich for lunch today.'],
    ['A little old lady', "We've worked together all this time, and I didn't know you could yodel."],
    ['Lettuce', "Lettuce at some point soon do more with this bot than tell silly jokes."],
  ]

  if (event.text.toLowerCase().match(/who.*s there/g)) {
    // Pick a random joke
    which_joke = Math.floor(Math.random()*jokes_the_bot_knows.length)
    exports.current_outgoing_joke = jokes_the_bot_knows[which_joke]
    return exports.current_outgoing_joke[0];
    // sendReply(response_text);
    // return true;
  }
  if (event.text.toLowerCase().match(/[a-z]+ who/g) && exports.current_outgoing_joke) {
    response_text = exports.current_outgoing_joke[1];
    // sendReply(response_text);
    exports.current_outgoing_joke = null;
    return response_text;
  }
  return false;
}
