// routes/location.route.js
import express from 'express';
import { states, cities } from '../data/stateAndCities.js';

const router = express.Router();

// Endpoint to get all states
router.get('/states', (req, res) => {
    res.json(states);
});

// Endpoint to get cities in a state
router.get('/cities/:state', (req, res) => {
    const state = req.params.state;
    const stateCities = cities[state];
    if (stateCities) {
        res.json(stateCities);
    } else {
        res.status(404).json({ error: 'State not found' });
    }
});

// Endpoint to search for states and cities
router.get('/search', (req, res) => {
    const query = req.query.q.toLowerCase();
    let suggestions = [];

    // Search states
    states.forEach(state => {
        if (state.toLowerCase().includes(query)) {
            suggestions.push({ type: 'state', name: state });
        }
    });

    // Search cities
    Object.keys(cities).forEach(state => {
        cities[state].forEach(city => {
            if (city.toLowerCase().includes(query)) {
                suggestions.push({ type: 'city', name: city, state: state });
            }
        });
    });

    res.json(suggestions);
});

export default router;
