require('dotenv').config();
const cors = require('cors');

//imported modules
const connectToDB = require('./database/db')
const authRouter = require('./routes/authRoutes');

//connect to mongodb
connectToDB();

const express = require('express');
const app = express();

//middlewares
app.use(cors())
app.use(express.json())

//routing
app.use('/api/auth/v1', authRouter);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})



