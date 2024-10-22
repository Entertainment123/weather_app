const base_path='assetts/animated/';

const weatherIcons = {
    '01d': `${base_path}clear-day.svg`,
    '01n': `${base_path}clear-night.svg`,
    '02d': `${base_path}cloudy-1-day.svg`,
    '02n': `${base_path}cloudy-1-night.svg`,
    '03d': `${base_path}cloudy-1-day.svg`,
    '03n': `${base_path}cloudy-1-night.svg`,
    '04d': `${base_path}cloudy-1-day.svg`,
    '04n': `${base_path}cloudy-1-night.svg`,
    '09d': `${base_path}rainy-1-day.svg`,
    '09n': `${base_path}rainy-1-night.svg`,
    '10d': `${base_path}rainy-1-day.svg`,
    '10n': `${base_path}rainy-1-night.svg`,
    '11d': `${base_path}thunderstorm.svg`,
    '11n': `${base_path}thunderstorm.svg`,
    '13d': `${base_path}snowy-1-day.svg`,
    '13n': `${base_path}snowy-1-night.svg`,
    '50d': `${base_path}cloudy-1-day.svg`,
    '50n': `${base_path}cloudy-1-night.svg`
};

function temp_conversion(kelvin){
    return kelvin - 273;
}

function time(milisecond){
    let data=new Date(milisecond*1000);
    let hours=data.getHours();
    let ampm=hours>=12?'PM':'AM';
    let time=hours%12===0?12:hours%12;
    let week=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    let arr=['January','February','March','April','May','June','July','August','September','October','November','December']
    return {
        TimeAmpm:`${time}${ampm}`,
        year:`${data.getFullYear()}`,
        date:`${data.getDate()}`,
        month: `${data.getMonth()}` ,
        alpha_month: `${arr[data.getMonth()]}`,
        alpha: arr,
        ampm: `${ampm}`,
        time: `${time}`,
        week: `${week[data.getDay()]}`
        
    }
}
function update_html(weather_obj,weather_obj_geo){
    const current_obj=weather_obj.current;

    // info-wrapper Updated individually cause layout of all is different //

    let humidity=document.getElementsByClassName('humidity-value');
    humidity[0].innerHTML=`<span class="humidity-percentage">${current_obj.humidity}%</span>`
    let h_detail=document.getElementsByClassName('h-details');
    h_detail[0].innerHTML=`<p class="h-detail">Feels like: ${current_obj.feels_like}F</p>
    <p class="h-detail">Dew Point: ${current_obj.dew_point}F</p>`
    let wind_detail=document.getElementsByClassName('wind-detail');
    wind_detail[0].innerHTML=`<h2>${current_obj.wind_speed}kph</h2>`
    let uv_detail=document.getElementsByClassName('UV-detail');
    uv_detail[0].innerHTML=`<h2>${current_obj.uvi} High</h2>`
    let pressure_detail=document.getElementsByClassName('pressure-detail');
    pressure_detail[0].innerHTML=`<h2>${current_obj.pressure}</h2><h2>mbar</h2>`
    let sun_detail=document.getElementsByClassName('sun-detail');
    sun_detail[0].innerHTML=`<p class="h-detail">Sunrise: ${time((current_obj.sunrise)).TimeAmpm}</p>
    <p class="h-detail">Sunset: ${time((current_obj.sunset)).TimeAmpm}</p>`;

    // Updating main_details....
    const dt=time(current_obj.dt);
    const path=weatherIcons[current_obj.weather[0].icon];
    document.getElementById('main-details').childNodes[0].innerHTML=`<h1>${weather_obj_geo[0].state} ${weather_obj_geo[0].name}</h1>
    <h3>${time(current_obj.dt).alpha_month} ${time(current_obj.dt).date} ${time(current_obj.dt).year} </h3><img src=${path}><h1>${current_obj.weather[0].main}</h1>`
    document.getElementsByClassName('data')[0].innerHTML=`<h1>${temp_conversion(Math.floor(current_obj.temp))}<span>&deg</span></h1>`

    // updating hourly da....
    const hourly=weather_obj.hourly;
    let hourly_card=document.getElementById('hourly_forcast');
    hourly_card.innerHTML="";
    hourly.forEach((element,index) => {
        if(index<12){
            const dt=time(element.dt);
            const path=weatherIcons[element.weather[0].icon];
            hourly_card.innerHTML+=`<div class="cards"><div id="time"> ${dt.time}:00 ${dt.ampm}</div>
            <div id="img"><img src="${path}"></div>
            <div id="det">${temp_conversion(Math.floor(element.temp))}<span>&deg;C</span></div>
            <div id="det">${element.weather[0].main}</div></div>`;}
        
    });
    const weekly=weather_obj.daily;
    let week_card=document.getElementById('week_forcast');
    week_card.innerHTML="";
    weekly.forEach(element => {
        const dt=time(element.dt);
        const path=weatherIcons[element.weather[0].icon];
        week_card.innerHTML+=`<div class="cards"><div id="time">${dt.week}</div>
        <div id="img"><img src="${path}"></div>
        <div id="det">${temp_conversion(Math.floor(element.temp.max))}<span>&deg;C</span></div>
        <div id="det">${element.weather[0].main}</div></div>`;
    });


}
async function weather(lat,lon){
    try{
        const res_geo=await fetch(`/geocoding?lat=${lat}&lon=${lon}`);
        const res=await fetch(`/weather-data?lat=${lat}&lon=${lon}`);
        if(!res.ok||!res_geo.ok){
            throw new Error("error occured");
        }
        const obj_res_geo=await res_geo.json();
        const obj_res=await res.json();
        update_html(obj_res,obj_res_geo);
        console.log(obj_res);
    }catch(err){
        console.log(err,"Error in fetching");
    }
}
if(!navigator.geolocation){
    alert("Geolocation not supported");
}

navigator.geolocation.getCurrentPosition((res)=>{
    const lat=res.coords.latitude;
    const lon=res.coords.longitude;
    weather(lat,lon);
    let cityName=document.getElementById('city');
    document.getElementById('search-icon').addEventListener('click',(e)=>{cityName.classList.toggle('city')})
    cityName.addEventListener('keypress',async(e)=>{const city=cityName.value;
        if(e.key==='Enter'){
    const geo=await fetch(`/city_geo?city=${city}`);
    const ans=await geo.json();
    weather(ans[0].lat,ans[0].lon)}},(err)=>{console.log(err);})})

let form=document.getElementsByClassName('collab');
let email; let pass;
let option;
let submit=document.getElementById('submit');
submit.addEventListener('click',(e)=>
{
    email=document.getElementById('email').value;
    pass=document.getElementsByClassName('info')[0].value;
    console.log(email,pass);
    option={
        headers:{
            'content-type':"application/json"
        },
        method:'post',
        Credentials:'same-origin',
        body:JSON.stringify({email:`${email}`,pass:`${pass}`})
    }
    fetch('/',option).then((res)=>{res.json().then((res)=>{console.log(res)})})
})
