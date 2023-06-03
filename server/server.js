const {readdirSync} = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const helmet = require('helmet');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const morgan = require('morgan');
require('dotenv').config();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

//routes middleware
readdirSync('./routes').map(r => app.use('/api/v1', require(`./routes/${r}`)));


//server
const port = process.env.PORT || 6060;

//connect with DB and server start
mongoose
    .connect(process.env.DATABASE)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port : ${port}`);
        });
    })
    .catch((err) => console.log(err));

