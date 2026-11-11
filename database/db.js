
const mongoose = require('mongoose');

const connectToDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected Successfully")
    } catch (error) {
        console.log("Cound not connect to DB", error);
        // like the return statement
        // process.exit() terminates the entire node environment immediately 
        // 1 means application should shut down in a controlled manner rather than abruptly
        process.exit(1);  
    }
    
}

module.exports = connectToDB;