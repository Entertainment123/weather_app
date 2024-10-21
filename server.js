let TelegramBot;
TelegramBot=require('node-telegram-bot-api');
let bot;
bot=require('./bot');
require('dotenv').config();
const e=require('express');
let  fs=require('fs');
const cors=require('cors');
const path = require('path');
const app=e();
const port=3000;
app.use(cors({origin:'/'}));

app.use(e.json());
app.use(e.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.htm'));
})

app.get('/weather-data',async (req,res)=>{
    const {lat,lon}=req.query;
    bot.user_location({lat:lat,lon:lon});
    const weather=await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`);
    const weather_obj=await weather.json();
    res.json(weather_obj);
});
app.get('/geocoding',async (req,res)=>{
    const {lat,lon}=req.query;
    const geo=await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`);
    const geo_obj= await geo.json();
    res.json(geo_obj);
});
app.get('/city_geo',async (req,res)=>{
    const {city}=req.query;
    const city_geo=await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.OPEN_WEATHER_API_KEY}`);
    const city_geo_obj=await city_geo.json();
    res.json(city_geo_obj);
})
app.post('/',(req,res)=>{
    const data=req.body;
    console.log(data);
    bot.Bot(data);
   
    res.json({name:"kaif"});
})

app.listen(port,()=>{console.log("running on port 3000")});