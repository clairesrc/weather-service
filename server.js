const axios = require('axios')
const express = require('express')
const asyncHandler = require('express-async-handler')
const publicIp = require('public-ip')
const figlet = require('figlet')
const moment = require('moment')

const port = process.env.APP_PORT
const darkSkyApiSecret = process.env.DARKSKY_API_SECRET
const ipstackApiSecret = process.env.IPSTACK_API_SECRET

const getGeoIp = ip => 
    axios.get(`http://api.ipstack.com/${ip}?access_key=${ipstackApiSecret}`)
        .catch(err => console.error(err))
        .then(({data}) => data)
        
const getWeather = ({latitude,longitude}) => 
    axios.get(`https://api.darksky.net/forecast/${darkSkyApiSecret}/${latitude},${longitude}`)
        .catch(err => console.error(err))
        .then(({data}) => { console.log(data); return data })
        // .then(({data}) => data)

const formatOutput = text => new Promise((resolve, reject) => 
    figlet(text, (err, data) => {
        if (err) return reject(err)
	    resolve(data)
    }))

const formatAllData = weather => 
    Promise.all([
        formatOutput(`updated ${moment().format('hh : mm : ss A')}`),
        formatOutput(`${weather.currently.temperature}°F`),
        formatOutput(weather.currently.summary)
    ])


const startServer = async () => {
    const geoIp = await publicIp.v4()
        .then(getGeoIp)

    const app = express()

    app.use(express.static('public'))
    
    app.get('/weather', asyncHandler(async (req, res) => 
        res.json(
            getWeather(geoIp)
            .then(formatAllData)
            .then(([time, temperature, summary]) => {time, temperature, summary})
            .catch(e => console.error))
    ))

    return app
}

startServer().then(app => app.listen(port, () => console.log(`Weather service listening on port ${port}`)))

