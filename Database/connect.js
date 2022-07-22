const mongoose = require('mongoose');

async function connect() {
    mongoose.connect(process.env.mongo, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection.once("open", () => {
        console.log('[DATABASE]: Connected To Database')
    })
    return;
}

module.exports = connect;