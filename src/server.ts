import express from 'express'
import FormatOutput from './lib/FormatOutput'
import Geoip from './lib/Geoip'
import Weather from './lib/Weather'

const ash = require('express-async-handler')
const moment = require('moment')

const port = process.env.APP_PORT
const darkSkyApiSecret = process.env.DARKSKY_API_SECRET
const ipstackApiSecret = process.env.IPSTACK_API_SECRET

const geoip = new Geoip(ipstackApiSecret)
const weather = new Weather(darkSkyApiSecret)

const formatAllData = weather => 
    Promise.all([
        new FormatOutput(`updated ${moment().format('hh : mm : ss A')}`),
        new FormatOutput(`${weather.currently.temperature}°F`),
        new FormatOutput(weather.currently.summary)
    ])

const getAndFormatWeather = (latitude, longitude) => 
    weather.getWeather(latitude, longitude)
    .then(formatAllData)
    .then(([time, temperature, summary]) => ({time, temperature, summary}))

const getGeoipAndFormattedWeather = () =>
    geoip.getGeoip()
    .then(data => getAndFormatWeather(data.latitude, data.longitude))

const app = express()

app.use(express.static('public'))

app.get('/weather', ash(async (req, res) => res.json(await getGeoipAndFormattedWeather())))

app.listen(port, () => console.log(`Weather service listening on port ${port}`))