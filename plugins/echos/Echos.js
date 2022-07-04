/*
    These are the stupid simple echo commands for the server
*/

export default function(bastion, config={}) {

    return [

        {
            command: "pitchforks",
            resolve: "**ANGRY AT OP?** WANT TO JOIN THE MOB? *WE'VE GOT YOU COVERED!

COME ON DOWN TO /r/pitchforkemporium


**WE GOT 'EM ALL!**

Traditional|Left Handed|Fancy
```_____________________________________
| Traditional | Left Handed | Fancy |
|    ---E     |      Ǝ---   |  ---{ |
-------------------------------------```
**WE EVEN HAVE DISCOUNTED CLEARANCE FORKS!**

```____________________________________________________
| 33% Off | 66% Percent Off | Manufactures Defect! |
|   ---F  |       ---L      |         ---e         |
----------------------------------------------------```

**NEW IN STOCK. DIRECTLY FROM LIECHTENSTEIN.** ***EUROPEAN MODELS!***

```___________________________________
| The Euro | The Pound | The Lira |
|   ---€   |    ---£   |   ---₤   |
-----------------------------------```

(some assembly required)


Edit: holy *sheet* my **FIRST GOLD** . Thank you kind stranger. I love you. Here is a custom pitchfork for you:

**─=≡Σᕕ( ͡° ͜ʖ ͡°)ᕗ**"
        },

        {
            command: "echo",
            restrict: ["admin"],
            options: bastion.parsers.split,
            resolve(context, [channelMention, ...msg]) {
                const channelID = channelMention.replace("<#", "").replace(">","")
                bastion.bot.simulateTyping(channelID)
                this.send(channelID, msg.join(" "))
            }
        },
        {
            command: "v",
            resolve: "Code last updated: 07/04/22"
        },
        {
            command: "git",
            resolve: "Github: https://github.com/qCzar/rbha-bot"
        },

        {
            command: "github",
            resolve: "Github: https://github.com/qCzar/rbha-bot"
        },

        {
            command: "bug",
            resolve: "Submit the bug here so I can keep track of them: https://github.com/hellos3b/sjbha-bot/issues/new"
        }

        // {
        //     command: "test",
        //     resolve(context) {
        //         console.log('channels', bastion.bot.channels[context.channelID].name)
        //     }
        // }

    ]
}
