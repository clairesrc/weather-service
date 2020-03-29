const axios = require('axios')
const publicIp = require('public-ip')

export default class Geoip {
    private apiSecret;
    private geoIp;

    constructor(apiSecret) {
        this.apiSecret = apiSecret
    }

    async getGeoip() {
        if (!this.geoIp) {
            this.geoIp = await publicIp.v4()
                .then(ip => axios.get(`http://api.ipstack.com/${ip}?access_key=${this.apiSecret}`)
                .then(({data}) => data))
                .catch(err => console.error(err))
        }
        return this.geoIp
    }
}