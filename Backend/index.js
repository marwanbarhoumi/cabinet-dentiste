const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL,
  ],
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/appointments', require('./routes/appointment.routes'));
app.use('/api/patients', require('./routes/patient.routes'));

app.get('/', (req, res) => res.send('🦷 Cabinet Dentiste API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));