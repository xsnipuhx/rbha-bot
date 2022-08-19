open StdLib
open Discord

type tldr = {
   message: string,
   from: string,
   timestamp: Date.t,
   channelID: string,
   channel: string
}

module Tldrs = {
   open MongoDb.Collection
   external unsafeCastTldrArray: {..} => array<tldr> = "%identity"

   let collection = lazy (MongoDb.getCollection ("tldrs"))

   let fetchRecent = count =>
      Lazy.force (collection)
         -> Promise.flatMap (collection => collection
            -> findAll
            -> sort ({"timestamp": -1})
            -> limit (count)
            -> toArray)
         -> Promise.map (any => any->unsafeCastTldrArray->Ok)
         -> Promise.catch (_ => Error(#DATABASE_ERROR))

   let insert = tldr => 
      Lazy.force (collection)
         -> Promise.flatMap (insertOne(_, tldr))
         -> Promise.map (_ => Ok(tldr))
         -> Promise.catch (_ => Error(#DATABASE_ERROR))
}

let tldrs_count = 10
let embed_color = 11393254

//
// Displays an overview of the most recent TLDRs that have been saved
// as well as who posted it and in which channel
//
let listRecentTldrs = (interaction: Interaction.t) => {
   let tldrs = Tldrs.fetchRecent(tldrs_count)

   tldrs->Promise.map (tldrs => switch tldrs {
      | Ok(tldrs) => {
         open Embed

         let embed = Embed.make()
            -> setTitle (`💬 TLDR`)
            -> setColor (embed_color)

         A.forEach (tldrs, tldr => {
            let value = `*${Date.fromNow (tldr.timestamp)} • ${tldr.from} • <#${tldr.channelID}>*`
            embed->addField(tldr.message, value, Full)->ignore
         })
  
         let privacy: Response.privacy =
            if interaction.channel.id === Sjbha.Channels.shitpost { Public } 
            else { Private }

         Response.Embed (embed, privacy)
      }

      | Error(#DATABASE_ERROR) => {
         Response.Error("Problem loading tldrs from database")
      }

      | _ => { 
         Response.Error ("Something unexpected happened")
      }
   })
}

//
// Lets a user save a new tldr into the db
//
let saveNewTldr = interaction => {
   let note = interaction
      -> Interaction.getRequiredStringOption ("note")

   let savedTldr = note->R.flatMapAsync(note => {
      let tldr = {
         message: note,
         from: interaction.user.username,
         timestamp: Date.make(),
         channelID: interaction.channel.id,
         channel: interaction.channel.name
      }

      Tldrs.insert (tldr)
   })
      
   savedTldr->Promise.map (tldr => switch tldr {
      | Ok(tldr) => {
         open Embed
         let embed = Embed.make ()
            -> setColor (embed_color)
            -> setDescription (`📖 ${tldr.message}`)

         Response.Embed (embed, Public)
      }

      | Error(#DATABASE_ERROR) => {
         Response.Error("Unable to save TLDR")
      }

      | Error(#MISSING_OPTION(name)) => {
         Response.Error(`Missing required option ${name}`)
      }

      | _ => { 
         Response.Error ("Unknown Reasons")
      }
   })
}

let command = SlashCommand.define (
   ~command = SlashCommand.make (
      ~name = "tldr",
      ~description = "Summarize things that happen on discord",
      ~subcommands = [
         SlashCommand.subcommand (
            ~name = "list",
            ~description = "Get a list of the most recent notes",
            ()),

         SlashCommand.subcommand (
            ~name = "save",
            ~description = "Save a new note",
            ~options = [
               SlashCommand.stringOption (
                  ~name = "note",
                  ~description = "What do you want to save?",
                  ~required = true,
                  ())
            ], ())
      ], ()),

   ~interaction = interaction => {
      let subcommand = interaction.options
         -> Interaction.getSubcommand

      let response = switch subcommand {
         | Some("list") => interaction->listRecentTldrs
         | Some("save") => interaction->saveNewTldr
         | _ => Response.Error("Invalid Command")->Promise.resolve
      }

      response->Promise.run (
         ~ok = Interaction.respond (interaction),
         ~catch = Interaction.error (interaction))
   }
)
