const axios = require('axios')
const express = require('express')
const asyncHandler = require('express-async-handler')
const publicIp = require('public-ip')

const port = process.env.APP_PORT
const darkSkyApiSecret = process.env.DARKSKY_API_SECRET
const ipstackApiSecret = process.env.IPSTACK_API_SECRET
const app = express()

app.use(express.static('public'))

app.get('/weather', asyncHandler(async (req, res) => res.json(
    await darkSkyCall( await getGeoIp(await publicIp.v4()) )
)))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const getGeoIp = async ip => 
    axios.get(`http://api.ipstack.com/${ip}?access_key=${ipstackApiSecret}`)
        .catch(err => console.error(err))
        .then(({data}) => {
            console.log(data)
            return data
        })
        
const darkSkyCall = async ({latitude,longitude}) => 
    axios.get(`https://api.darksky.net/forecast/${darkSkyApiSecret}/${latitude},${longitude}`)
        .catch(err => console.error(err))
        .then(({data}) => data)