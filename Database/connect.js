const mongoose = require('mongoose');

async function connect() {
    if(!process.env.mongo){
        console.warn(`[DATABASE] For database access, MongoDB URI, is required in .env file.`)
        return
    }
    mongoose.connect(process.env.mongo, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).catch(e => console.log('No Database added'));

    mongoose.connection.once("open", () => {
        console.log('[DATABASE] Connected To Database')
    })
    return;
}

module.exports = connect;
