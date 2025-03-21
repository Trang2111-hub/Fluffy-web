const mongoose = require('mongoose');

async function connect(){
    try {
        console.log('Đang kết nối đến MongoDB với URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB successfully');
        return true;
    } catch (error) {
        console.log('Error connecting to MongoDB:', error.message);
        return false;
    }
}

module.exports = { connect };