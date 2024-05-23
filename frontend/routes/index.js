const express = require('express');
const axios = require('axios');
const router = express.Router();
const env = require('dotenv').config();
const cors = require('cors');
const createDemande = require('../services/demande');

router.use(cors());

var { body, validationResult } = require('express-validator');
var sanitizeHtml = require('sanitize-html');

router.get('/', async (req, res, next) => {
  const assetPath = process.env.ASSETS_URL;
  const startPath = process.env.API_URL;

  const endpoints = [
    'acceuil',
    'centres_intrets',
    'etudes',
    'experiences_professionnels',
    'frameworks',
    'languages_inforamtiques',
    'projects',
    'reseaux',
    'resumee',
    'services',
    'statistiques',
    'temoignages'
  ];

  try {
    const fetchPromises = endpoints.map(endpoint =>
      axios.get(`${startPath}${endpoint}`).then(response => response.data)
    );

    const results = await Promise.all(fetchPromises);

    const data = {
      acceuil: results[0],
      centres_intrets: results[1],
      etudes: results[2],
      experiences_professionnels: results[3],
      frameworks: results[4],
      languages_inforamtiques: results[5],
      projects: results[6],
      reseaux: results[7],
      resumee: results[8],
      services: results[9],
      statistiques: results[10],
      temoignages: results[11],
      assetPath,
      startPath
    };

    res.render('index', data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des données depuis l\'API.');
  }
});

router.get('/details/:id', async (req, res, next) => {
  const id = req.params.id;
  const assetPath = process.env.ASSETS_URL;
  const startPath = process.env.API_URL;

  try {
    const response = await axios.get(`${startPath}projects/${id}`);
    const details = response.data;

    res.render('details', { details, assetPath, startPath });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des données depuis l\'API.');
  }
});



router.post('/',
    body('nom').trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('sujet').trim().escape(),
    body('message').customSanitizer(value => sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {}
    })),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error_messages', 'Validation errors occurred. Please check the form.');
        return res.redirect('/');
      }
      const { nom, email, sujet, message } = req.body; // Wrap the destructuring assignment in parentheses
      // Process the sanitized data
      await createDemande({ nom, email, sujet, message });
      req.flash('success_messages', 'Form submission successful');
      res.redirect('/');
    }
);


module.exports = router;
