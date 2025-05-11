const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const profileRoutes = require('./routes/profile');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', profileRoutes);

app.use('/api', authRoutes);
app.use('/api/lost-items', itemRoutes); // <-- handles /api/lost-items POST
app.use('/', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
