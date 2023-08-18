/*
    This file is used to handle the routes for the players
 */
// Import express
const express = require('express');
const router = express.Router();


//placeholder for players
let players = [];

//CRUD routes

//CREATE - POST
router.post('/', (req, res) => {
    const player = req.body;
    players.push(player);``
    res.json({ message: 'Player added successfully!' });
});

//READ - GET
router.get('/', (req, res) => {
    res.json(players);
});

//UPDATE - PUT
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedPlayer = req.body;
    //find and update player HERE
    res.json({ message: 'Player updated successfully!' });
});

//DELETE - DELETE
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    //find and delete player HERE
    res.json({ message: 'Player deleted successfully!' });
});

module.exports = router;