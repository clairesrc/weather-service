import express from 'express'
import Geoip from './lib/Geoip'
import FormatOutput from './lib/FormatOutput'
import Weather from './lib/Weather'
import axios from 'axios'

const ash = require('express-async-handler')
const moment = require('moment')

const port = process.env.APP_PORT
const darkSkyApiSecret = process.env.DARKSKY_API_SECRET
const ipstackApiSecret = process.env.IPSTACK_API_SECRET

axios.defaults.baseURL = `http://localhost:${port}`

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
    axios.get(`/geoIp`)
    .then(({data}) => axios.get(`/weather/${data.latitude}/${data.longitude}`))
    .then(({data}) => data)

const app = express()

app.use(express.static('public'))

app.get('/geoIp', ash(async (req, res) => res.json(await geoip.getGeoip())))

app.get('/weather/:lat/:lon', ash(async (req, res) => res.json(await getAndFormatWeather(req.params.lat, req.params.lon))))

app.get('/weather', ash(async (req, res) => res.json(await getGeoipAndFormattedWeather())))

app.listen(port, () => console.log(`Weather service listening on port ${port}`))