require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const unifiedRoutes = require('./routes/unified');

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/unified', unifiedRoutes);

app.get('/', (req,res) => res.send('Pinto API Core is Active.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Pinto running on port ${PORT}'));