import figlet from 'figlet'

export default class FormatOutput {
    constructor(text) {
        return new Promise((resolve, reject) => 
            figlet(text, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            }))
    }
}