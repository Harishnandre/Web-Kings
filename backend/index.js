const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const userroutes = require('./routes/userroutes');
const fooditemsroutes = require('./routes/fooditemsroutes');
const canownerroutes = require('./routes/Canownerroutes');
const canteenroutes = require('./routes/canteenroutes');
const cartroutes = require('./routes/cartRoutes');
const ratingsroutes = require('./routes/ratingsroutes');

app.use('/api/can', canteenroutes);
app.use('/api/users', userroutes);
app.use('/api/item', fooditemsroutes);
app.use('/api/canowner', canownerroutes);
app.use('/api/ratings', ratingsroutes);
app.use('/api/cart', cartroutes);

mongoose
  .connect(process.env.mongoDB_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch(err => {
    console.log(err);
  });





