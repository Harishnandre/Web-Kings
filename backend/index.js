const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
// bodyparser is used to parse the body 
app.use(bodyParser.json());
// Enable CORS for all routes
app.use(cors());
const userroutes = require('./routes/userroutes');
const fooditemsroutes = require('./routes/fooditemsroutes');
const canownerroutes = require('./routes/Canownerroutes');
const canteenroutes= require('./routes/canteenroutes');

app.use('/api/can',canteenroutes);
app.use('/api/users', userroutes);
app.use('/api/item', fooditemsroutes);
app.use('/api/canowner', canownerroutes);

mongoose  
.connect("mongodb+srv://harishnandre1:Harish%402005@cluster0.qeqtarl.mongodb.net")
.then(()=> {
    app.listen(3000);
})
.catch(err => {
console.log(err);
});





