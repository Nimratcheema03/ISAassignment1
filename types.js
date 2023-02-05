
const https = require('https');
const mongoose = require('mongoose')

async function types() {
    return new Promise((resolve, reject) => {
    https.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json', (res)=>{
        let data = ""
        res.on('data', (chunk)=>{
            data+=chunk
        })
        res.on('end', async()=>{
            arr = JSON.parse(data)
            arr = await arr.map( x => x.english)
            pokemonSchema = new mongoose.Schema ({
                "id": {
                type: Number,
                required: true,
                unique: true
                },
                "name": {
                    "english": {
                        type : String,
                        maxlength: 20,
                        required: true
                    },
                    "japanese": String,
                    "chinese": String,
                    "french": String

                },
                "type" : arr,
                "base" : {
                    "HP": Number,
                    "Attack": Number,
                    "Defense": Number,
                    "Speed Attack": Number,
                    "Speed Defense": Number,
                    "Speed": Number
                }
            })
        resolve(pokemonSchema);
    })
})
    });
}

module.exports = { types }