// import 'mocha'
// import {expect} from 'chai'
// import { run } from 'bastion/mock'
// // import Ping from './ping'

// describe('!ping', () => {
//   it('responds with Pong', async () => {
//     const result = await run(Ping, "!ping")

//     expect(result.reply.message).to.equal("Pong!")
//   });

//   it('responds with custom response', async () => {
//     Ping.config = {
//       response: "Changed!"
//     }
    
//     const result = await run(Ping, "!ping")

//     expect(result.reply.message).to.equal("Changed!") 
//   });
// });