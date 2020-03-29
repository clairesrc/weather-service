import axios from 'axios'

export default class Weather {
    private apiSecret;

    constructor(apiSecret) {
        this.apiSecret = apiSecret
    }

    getWeather(latitude, longitude) {
        return axios.get(`https://api.darksky.net/forecast/${this.apiSecret}/${latitude},${longitude}`)
        .catch(err => console.error(err))
        .then(({data}:any) => data)
    }
}