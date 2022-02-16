const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require("./models/http-error")

const todo = require('./routes/to-do')
const authentication = require('./routes/authentication');
const  mongoose  = require('mongoose');

const app = express();
const port = 5000;

app.use(bodyParser.json());


app.use('/api', authentication)
app.use('/api', todo);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route. Please check again', 404);
    throw error;
})
app.use((error, req, res, next) => { 
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message:error.message || "An unknown error occured"})
})

mongoose.connect('mongodb+srv://himathPerera:himathPerera123@cluster0.hmakd.mongodb.net/ToDos_surgeGlobal?retryWrites=true&w=majority').then(() => {
    app.listen(port);
    console.log('listning on port : '+ port)
}).catch(err => { 
    console.log(err)
})