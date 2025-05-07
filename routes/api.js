//  Importation des modules nécessaires
const express = require('express');
const router = express.Router();
const Formation = require('../models/Formations');
const Temoignage = require('../models/Temoignage');
const Utilisateur = require('../models/Utlisateurs'); 
const Admin = require('../models/Admins'); // 🛠️ adapte le chemin si besoin
const bcrypt = require('bcrypt');


const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');


// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img'); //  Dossier où seront stockées les images
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// 🧩 Initialisation de multer avec le storage défini
const upload = multer({ storage });

/**
 * @route   POST /api/formations
 * @desc    Ajouter une nouvelle formation
 * @access  Public (pour l’instant)
 */
router.post('/formations', upload.single('image'), async (req, res) => {
  try {
    const { titre,slug,accroche,description,duree,prix,videoUrl,niveau,categorie,dateDebut} = req.body;
    const imageUrl = req.file ? `/img/${req.file.filename}` : ''; // ⬅️ on récupère l'image téléchargée

    // Vérification des champs requis
    if (!titre || !slug || !description || !prix || !accroche || !duree || !niveau || !categorie || !dateDebut) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    // Création d'une nouvelle formation
    const nouvelleFormation = new Formation({
      titre,
      slug,
      accroche,
      description,
      imageUrl,
      duree,
      prix,
      videoUrl,
      niveau,
      categorie,
      dateDebut
    });

    await nouvelleFormation.save();
    res.status(201).json({ message: "Formation ajoutée avec succès", formation: nouvelleFormation });

  } catch (err) {
    console.error("Erreur lors de l'ajout :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @route   POST /api/temoignages
 * @desc    Ajouter un témoignage client lié à une formation
 * @access  Admin
 */
router.post('/temoignages', upload.single('avatar'), async (req, res) => {
  try {
    const { nomClient, message, formationId } = req.body;

    if (!nomClient || !message || !formationId) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Vérification si la formation existe
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    const nouveauTemoignage = new Temoignage({
      nomClient,
      message,
      avatar: req.file ? `/img/${req.file.filename}` : '',
      formationId
    });

    await nouveauTemoignage.save();

    res.status(201).json({ message: "Témoignage ajouté avec succès", temoignage: nouveauTemoignage });

  } catch (error) {
    console.error("Erreur ajout témoignage :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route GET pour récupérer toutes les formations Dpuis la base de donné pour les stocker
router.get('/formations', async (req, res) => {
  try {
    const formations = await Formation.find();
    res.json(formations);
  } catch (err) {
    console.error("Erreur lors de la récupération des formations :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route GET pour récupérer une formation spécifique avec ses témoignages depuis la base de donnée pour les stocker
router.get('/formations/:slug', async (req, res) => {
  try {
    // Recherche de la formation par son slug
    const formation = await Formation.findOne({ slug: req.params.slug });
    if (!formation) return res.status(404).send("Formation non trouvée");

    // Récupération des témoignages associés à cette formation
    const testimonials = await Temoignage.find({ formationId: formation._id });

    res.render('landing', { formation, testimonials }); // Affichage sur la page 'landing' (si on utilise EJS)

  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

// Recuperation  des temoignages pour les afficher Sur le front


/**
 * @route   GET /api/temoignages
 * @desc    Récupérer tous les témoignages (pour affichage public)
 * @access  Public
 */
router.get('/temoignages', async (req, res) => {
  try {
    const temoignages = await Temoignage.find().sort({ createdAt: -1 }).limit(10); // tu peux adapter
    res.json(temoignages);
  } catch (err) {
    console.error("Erreur récupération témoignages :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});








// Route POST pour inscription
router.post('/inscription', async (req, res) => {
  try {
    const { nom, Whatsapp, formation } = req.body;

    const nouvelInscrit = new Utilisateur({ nom, Whatsapp, formation });
    await nouvelInscrit.save();

    res.status(201).json({ message: "Inscription enregistrée avec succès !" });
  } catch (error) {
    console.error("Erreur d'inscription :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
});






// route pour afficher les inscrits sur le dashboard


router.get('/', async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find().sort({ _id: -1 });
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});






// Route de connexion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) return res.status(401).json({ message: "Nom d'utilisateur incorrect." });

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) return res.status(401).json({ message: "Mot de passe incorrect." });

    // Auth OK (tu peux gérer un token ici si tu veux)
    return res.status(200).json({ message: "Connexion réussie." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});









module.exports = router;
