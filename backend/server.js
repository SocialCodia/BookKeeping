const express = require('express');
const PORT = process.env.PORT || 5500;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const dbConnection = require('./configs/db-config');
const authRoute = require('./routes/auth-route');
const errorMiddleware = require('./middlewares/error-middleware');
const app = express();

//Cors Option
const corsOption = {
    credentials:true,
    origin:['http://localhost:3000','http://localhost:4000']
}

// Database Connection
dbConnection();

//Configuration
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth',authRoute);


//Middlewares
app.use(errorMiddleware);




app.listen(PORT,()=>console.log(`Listining On Port : ${PORT}`));