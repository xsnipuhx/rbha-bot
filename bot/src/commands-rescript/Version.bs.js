// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var StdLib = require("../common/StdLib.bs.js");
var Discord = require("../common/Discord.bs.js");
var SlashCommand = require("../common/SlashCommand.bs.js");

var command = SlashCommand.define(SlashCommand.make("version", "Check which version the bot is currently running", undefined, undefined), (function ($$int) {
        return StdLib.done(Discord.Interaction.respond($$int, {
                        TAG: /* Text */0,
                        _0: "BoredBot " + process.env.npm_package_version,
                        _1: /* Public */0
                      }));
      }));

exports.command = command;
/* command Not a pure module */
