const Telegraf = require('telegraf')
const Route = require('./route/route')

const bot = new Telegraf(process.env.KINGSTON_BOT_TOKEN)
bot.use(Telegraf.log())

bot.command('start', (ctx) => {
  Route.commStart(ctx)
})

bot.hears('🇺🇿', (ctx) => {
  Route.hearSetUz(ctx)
})

bot.hears('🇷🇺', (ctx) => {
  Route.hearSetRu(ctx)
})

bot.hears('🇬🇧', (ctx) => {
  Route.hearSetEn(ctx)
})

bot.on('text', ctx =>{
  Route.onText(ctx)
})

bot.on('contact', ctx=>{
  Route.setPhone(ctx)
})

bot.on('callback_query', (ctx) => {
  Route.onCallBack(ctx)
})

bot.startPolling()