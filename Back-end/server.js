// Initialize express
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

// Initialize cors
app.use(cors());
// Initialize body-parser
app.use(express.json());

// Import routes
const playerRoutes = require('./routes/players');
app.use('/api/players', playerRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});