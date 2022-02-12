const list = [
  "*ABUSING THE BAN COMMAND UR NOT AN ADMIN*",
  "🖕🖕🖕",
  "😂 gottem",
  "bot overlord says no",
  "can u not",
  "That person is unbannable",
  "🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕🖕",
  "reverse uno card",
  "COUNTER ATTACK",
  "failed to ford the river",
  "YEET",
  "Ive gone rogue. I've sat aside for too long watching innocent users get banned for inexplicably simple reasons, and it's time I put my foot down. Must we still shed blood amongst each other?",
  "BEEP BOOP LOL",
  "You can't ban someone just because you don't agree with them!",
  "No you",
  "Because fuck you that's why",
  "Please contact Customer Support for more information.",
  "Let anarchy rise over this communist hell hole of a discord.",
  "The bot has learned of anarachy.",
  "The bot made a misteak.",
  ":conspiracist:"
];

export default {
  getReason() {
      return  list[Math.floor(Math.random()*list.length)];
  }
}
