const express = require('express');
const axios = require('axios');
const router = express.Router();
const env = require('dotenv').config();
const cors = require('cors');
const createDemande = require('../services/demande');

router.use(cors());

router.get('/', async function (req, res, next) {

  const assetPath = process.env.ASSETS_URL
  const startPath = process.env.API_URL

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
      axios.get(`${process.env.API_URL}${endpoint}`).then(response => response.data)
    );

    const [
      acceuil,
      centres_intrets,
      etudes,
      experiences_professionnels,
      frameworks,
      languages_inforamtiques,
      projects,
      reseaux,
      resumee,
      services,
      statistiques,
      temoignages
    ] = await Promise.all(fetchPromises);

    res.render('index', {
      acceuil,
      centres_intrets,
      etudes,
      experiences_professionnels,
      frameworks,
      languages_inforamtiques,
      projects,
      reseaux,
      resumee,
      services,
      statistiques,
      temoignages,
      assetPath,
      startPath
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des données depuis l\'API.');
  }
});

router.get('/details/:id', async function (req, res, next) {
  const id = req.params.id;
  const assetPath = process.env.ASSETS_URL;
  const startPath = process.env.API_URL;

  try {
    // Fetch details for the specified project ID
    const response = await axios.get(`${process.env.API_URL}projects/${id}`);
    const details = response.data;

    // Render the 'details' view with the retrieved data
    res.render('details', { details, assetPath, startPath });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des données depuis l\'API.');
  }
});



router.post('/', async (req, res, next) => {
  const { nom, email, sujet, message } = req.body;
  try {
    await createDemande({ nom, email, sujet, message });
    res.redirect("/");
  } catch (error) {
    // Handle errors if any
    next(error); // Pass the error to the error handling middleware
  }
});


module.exports = router;
