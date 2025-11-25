require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const unifiedRoutes = require('./routes/unified');

app.use(express.json());

// Mount the routers. All routes defined inside authRoutes will be prefixed with /auth
app.use('/auth', authRoutes);
app.use('/unified', unifiedRoutes);

app.get('/', (req,res) => res.send('Pinto API Core is Active.'));

const PORT = process.env.PORT || 3000;
// Using backticks for template literal interpolation
app.listen(PORT, () => console.log(`Pinto running on port ${PORT}`));