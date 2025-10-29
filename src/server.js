require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');


const app = express();
app.use(bodyParser.json());


app.use('/auth', authRoutes);
app.use('/v1', apiRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Pinto dev server running on ${port}`));