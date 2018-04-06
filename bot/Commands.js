/**
 *  List of commands for the bot to listen to
 * 
 */

import Meetup from './Meetup'
import MeetupsDB from './MeetupsDB'
import logger from 'winston'
import Query from './Query'
import channels from './channels'
import moment from 'moment'

export default {

    // !ping
    "!ping"({bot, channelID}) {
        bot.sendMessage({
            to: channelID,
            message: "Pong (:"
        });
    },

    // Start a meetup
    "!meetup": async function({bot, user, channelID, userID, message}) {
        const msg = message.replace("!meetup", "");
        const [date, info] = msg.split("|").map( s => s.trim() );

        try {
            const meetup = new Meetup({
                date,
                info,
                userID,
                username: user,
                sourceChannelID: channelID
            });

            let error = await meetup.validate(bot);
            if (error) {
                bot.sendMessage({
                    to: channelID,
                    message: error
                });
                return;
            }

            // Post the meetup in meetup announcements
            await meetup.announce(bot);
            await meetup.confirm(bot);

            MeetupsDB.save(meetup);
        } catch (e) {
            logger.error(e);
        }
    },

    "!swirls": async function({bot, channelID}) {
        await bot.sendMessage({
            to: channelID,
            message: "<:swirls:430968917540995072><:swirls:430968917540995072><:swirls:430968917540995072><:swirls:430968917540995072>\:laughing:\:rofl:  DID SOMEBODY SAY SWIRLS?! \:rofl:\:laughing:<:swirls:430968917540995072><:swirls:430968917540995072><:swirls:430968917540995072><:swirls:430968917540995072>"
        })
    },

    "!admin": async function({bot, message, channelID, userID}) {
        if (channelID !== channels.ADMIN) {
            return;
        }
        const [cmd, cmd2, data] = message.split(" ");
        const param = cmd2.trim();

        if (param === "help") {
            await bot.sendMessage({
                to: channelID,
                message: "```" +
                    "!admin list\n    List current active meetups along with their IDs```"
            });
        } else if (param === "list") {
            let meetups = await MeetupsDB.getMeetups();
            if (meetups.length === 0) {
                await bot.sendMessage({
                    to: channelID,
                    message: "No active meetups."
                });
                return;
            }

            meetups = meetups.map( m => `${m.id}: ${m.info}`)
                .join("\n");

            await bot.sendMessage({
                to: channelID,
                message: "```"+meetups+"```"
            });
        } else if (param === "remind") {
            let meetupId = data;
            let meetup = await MeetupsDB.findMeetup(meetupId);

            if (!meetup) {
                await bot.sendMessage({
                    to: channelID,
                    message: `Can't find meetup with id \`${meetupId}\``
                });
                return;
            }
            let meetup_time = new moment(meetup.timestamp);
            await bot.sendMessage({
                to: meetup.sourceChannelID,
                message: `Reminder! There's the meetup \`${meetup.info}\` ${meetup_time.fromNow()}!`
            });
        } else if (param === "clean") {
            const meetups = await MeetupsDB.getMeetups();

            const old_meetups = meetups.filter(m => {
                let diff = moment().utcOffset(-8).diff(m.timestamp, 'hours');
                logger.info("Date: "+m.date + " diff: " +diff);
                return diff >= 2;
            });
    
            if (!old_meetups.length) {
                return;
            }
    
            for (var i = 0; i < old_meetups.length; i++) {
                let meetup = new Meetup(old_meetups[i]);
                let archive = await meetup.toArchiveJSON(bot);
                await meetup.finish(bot);
                MeetupsDB.archive(archive);
                await bot.sendMessage({
                    to: channels.ADMIN,
                    message: "`Archived "+meetup.info_str()+"`"
                });
            }
        }
    },

    "!debug": async function({bot, message, channelID, userID}) {
        if (channelID !== channels.ADMIN) {
            return;
        }

        const [cmd, param] = message.split(" ");

        if (param.trim() === "mine") {
            let meetups = await MeetupsDB.findByUserID(userID);

            if (meetups.length === 0) {
                await bot.sendMessage({
                    to: channelID,
                    message: "You have no active meetups"
                });
                return;
            }
            meetups = meetups.map( m => m.id + " " + m.info)
                .join("\n");
            await bot.sendMessage({
                to: channelID,
                message: meetups
            });
        } else if (param.trim() === "reactions") {
            let meetup_json = await MeetupsDB.getLatest();
            let meetup = new Meetup(meetup_json);
            let reactions = await meetup.getReactions(bot);
            await bot.sendMessage({
                to: channelID,
                message: `Yes: ${reactions.yes.length}, Maybe: ${reactions.maybe.length}`
            });
        } else if (param.trim() === "meetups") {
            await bot.sendMessage({
                to: channelID,
                message: "https://sjbha-bot.herokuapp.com/db/meetups.json"
            })
        } else if (param.trim() === "archive") {
            await bot.sendMessage({
                to: channelID,
                message: "https://sjbha-bot.herokuapp.com/db/archive.json"
            })
        } else if (param.trim() === "leaderboard") {
            await bot.sendMessage({
                to: channelID,
                message: "https://sjbha-bot.herokuapp.com/db/swirls.json?f=leaderboard"
            })
        } else if (param.trim() === "count") {
            
        }
    },

    "!finish": async function({ bot, message }) {
        const [cmd, id] = message.split(" ").map( m => m.trim() );

        const meetup_json = await MeetupsDB.findMeetup(id);
        const meetup = new Meetup(meetup_json);
        let archive = await meetup.toArchiveJSON(bot);
        await meetup.finish(bot);
        MeetupsDB.archive(archive);
    },

    "!cancel": async function({ bot, message, userID, channelID }) {
        const [cmd, id] = message.split(" ").map( m => m.trim() );

        let meetups = await MeetupsDB.findByUserID(userID);
        meetups = meetups.map( m => new Meetup(m));
        let meetup = null;

        if (meetups.length === 0) {
            await bot.sendMessage({
                to: channelID,
                message: "You don't have any active meetups to cancel!"
            });
            return;
        }

        let meetup_list = meetups.map( (m, i) => i + ": " + m.info() ).join("\n");
        await bot.sendMessage({
            to: channelID,
            message: "Which meetup do you want to cancel?\n```"+meetup_list+"```"
        });
        let index = await Query.wait({userID, channelID});
        if (index === null) {
            return;
        }
        if (index < 0 || index >= meetups.length) {
            await bot.sendMessage({
                to: channelID,
                message: "That wasn't one of the choices"
            });
            return;
        }
        meetup = meetups[index];

        await meetup.cancel(bot);
        MeetupsDB.remove(meetup);

        await bot.sendMessage({
            to: channelID,
            message: "Canceled `"+meetup.info_str()+"`"
        });
    },

    /*
        !edit date 4/3 8:00pm
        > edits most recent ones date
        !edit info Comedy night at hapa's
        !edit date
        !edit info
        !edit

    */
    "!edit": async function({bot, message, channelID, userID}) {
        let [cmd, param] = message.split(" ").map(m => m.trim());

        let meetups = await MeetupsDB.findByUserID(userID);
        meetups = meetups.map( m => new Meetup(m));
        let meetup = null;

        if (meetups.length === 0) {
            await bot.sendMessage({
                to: channelID,
                message: "You don't have any active meetups to edit!"
            });
            return;
        }

        let meetup_list = meetups.map( (m, i) => i + ": " + m.info() ).join("\n");
        await bot.sendMessage({
            to: channelID,
            message: "Which meetup do you want to edit?\n```"+meetup_list+"```"
        });
        let index = await Query.wait({userID, channelID});
        if (index === null) {
            return;
        }
        if (index < 0 || index >= meetups.length) {
            await bot.sendMessage({
                to: channelID,
                message: "That wasn't one of the choices"
            });
            return;
        }
        meetup = meetups[index];

        if (!param) {
            await bot.sendMessage({
                to: channelID,
                message: `Ok, editing \`${meetup.info_str()}\` - What do you want to change it to?\nUse format: \`date | info\``
            });
            let edit = await Query.wait({userID, channelID});
            if (!edit) {
                return;
            }

            let [date, info] = edit.split("|").map(e => e.trim());
            meetup.update(date, info);
        } else if (param === "date") {
            await bot.sendMessage({
                to: channelID,
                message: `Ok, editing \`${meetup.info_str()}\` - What do you want to change the date to?`
            });
            let new_date = await Query.wait({userID, channelID});
            if (!new_date) {
                return;
            }
            meetup.update(new_date, meetup.info_str());
        } else if (param === "info") {
            await bot.sendMessage({
                to: channelID,
                message: `Ok, editing \`${meetup.info_str()}\` - What do you want to change the info to?`
            });
            let new_info = await Query.wait({userID, channelID});
            if (!new_info) {
                return;
            }
            meetup.update(meetup.date(), new_info);
        }

        let error = await meetup.validate(bot, false);
        if (error) {
            await bot.sendMessage({
                to: channelID,
                message: error
            });
            return;
        }

        meetup.editInfo(bot);
        MeetupsDB.save(meetup);

        await bot.sendMessage({
            to: channelID,
            message: `You got it! Updated to \`${meetup.info()}\``
        })
    },

    "!help": async function({ bot, message, userID, channelID }) {
        await bot.sendMessage({
            to: channelID,
            message: "```"+
                "Creating a meetup: \n"+
                "   !meetup month/time hour:min | meetup_info\n\n"+
                "   Examples:\n"+
                "       !meetup 4/3 5:00pm | Bowling in Sunnyvale\n" + 
                "       !meetup Friday 6:00pm | Free comedy @ Hapas\n\n" +
                "Canceling a meetup: \n"+
                "   !cancel\n\n"+
                "Editing a meetup: \n"+
                "   !edit\n"+
                "   !edit date\n"+
                "   !edit info\n\n"+
                "Marking a meetup as Done: \n"+
                "   The bot will auto mark any meetup 4 hours after the date/time```"
        });
    },

};
