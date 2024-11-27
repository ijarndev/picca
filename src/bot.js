
import TelegramBot from 'node-telegram-bot-api'
import axios from 'axios'
import { loadEnvFile } from 'node:process'
import { log, getResponse } from './lib/utils.js'
import fs, { existsSync } from 'node:fs'

const envFile = '.env1'

if(existsSync(envFile)) {
  loadEnvFile(envFile)
} else {
  throw new Error('Missing env file')
}

const tgToken = process.env.TELEGRAM_BOT_API_TOKEN
const bot = new TelegramBot(tgToken, {polling: true})

const user = {
  id: null
}

log('System running and waiting for incoming requests...')

const sendCatPic = (url) => {
  bot.sendPhoto(user.id, url, { caption: getResponse('bot_image_sent') })
  log(`[O] delivering image to ${user.id}`)
}

bot.on('message', async (msg) => {
  user.id = msg.chat.id  
  let { text } = msg
  text = text.trim().toLowerCase()
  
  log(`[I] incoming request from (${user.id}) | command: ${text}`)

  if(text === '/start') {
    bot.sendMessage(user.id, getResponse('bot_init'))
    return
  }
  
  if (text === '/cat'){
    await bot.sendMessage(user.id, getResponse('bot_searching_image'))
    const res = await axios.get('https://api.thecatapi.com/v1/images/search')
    
    sendCatPic(res.data[0].url)
    return
  }

  bot.sendMessage(user.id, getResponse('bot_unknown_command'))
})

bot.on("polling_error", console.log);