const axios = require('axios')
const publicIp = require('public-ip')

export default class Geoip {
    private apiSecret;

    constructor(apiSecret) {
        this.apiSecret = apiSecret
    }

    async getGeoip() {
        return publicIp.v4()
        .then(ip => axios.get(`http://api.ipstack.com/${ip}?access_key=${this.apiSecret}`)
        .then(({data}) => data))
        .catch(err => console.error(err))
    }
}