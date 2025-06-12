//  Importation des modules nécessaires
const express = require('express');
const router = express.Router();
const Formation = require('../models/Formations');
const Temoignage = require('../models/Temoignage');
const Utilisateur = require('../models/Utlisateurs'); 
const Admin = require('../models/Admins'); // 🛠️ adapte le chemin si besoin
const bcryptjs = require('bcryptjs');
const { storage } = require('../config/cloudinary'); // ← on importe le storage Cloudinary


const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');


// Configuration de multer pour le stockage des fichiers
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname,'../../public/img') ); //  Dossier où seront stockées les images
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + '-' + file.originalname;
//     cb(null, uniqueName);
//   }
// });

// 🧩 Initialisation de multer avec le storage défini
const upload = multer({ storage });

/**
 * @route   POST /api/formations
 * @desc    Ajouter une nouvelle formation
 * @access  Public (pour l’instant)
 */
router.post('/formations', upload.single('image'), async (req, res) => {
  try {
    const { titre, slug, accroche, description, duree, prix, videoUrl, niveau, categorie, dateDebut } = req.body;

    if (!titre || !slug || !description || !prix || !accroche || !duree || !niveau || !categorie || !dateDebut) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    const imageUrl = req.file?.path; // ← URL Cloudinary

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

    const formation = await Formation.findById(formationId);
    if (!formation) return res.status(404).json({ message: "Formation non trouvée" });

    const avatarUrl = req.file?.path; // ← URL Cloudinary

    const nouveauTemoignage = new Temoignage({
      nomClient,
      message,
      avatar: avatarUrl,
      formationId
    });

    await nouveauTemoignage.save();
    res.status(201).json({ message: "Témoignage ajouté avec succès", temoignage: nouveauTemoignage });

  } catch (err) {
    console.error("Erreur ajout témoignage :", err);
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



// 🗑️ Supprimer une inscription
router.delete('/inscriptions/:id', async (req, res) => {
  try {
    const inscription = await Utilisateur.findByIdAndDelete(req.params.id); // 🔁 Changement ici
    if (!inscription) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }
    res.status(200).json({ message: 'Inscription supprimée avec succès' });
  } catch (err) {
    console.error("Erreur suppression inscription :", err);
    res.status(500).json({ message: 'Erreur serveur' });
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

    const passwordMatch = await bcryptjs.compare(password, admin.password);

    if (!passwordMatch) return res.status(401).json({ message: "Mot de passe incorrect." });

    // Auth OK (tu peux gérer un token ici si tu veux)
    return res.status(200).json({ message: "Connexion réussie." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});





router.get('/sessions/:slug', async (req, res) => {
  try {
    const formation = await Formation.findOne({ slug: req.params.slug });
    if (!formation) return res.status(404).json({ message: "Formation non trouvée" });

    const testimonials = await Temoignage.find({ formationId: formation._id });

    res.json({ formation, testimonials });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});







/**
 * @route   PUT /api/formations/:id
 * @desc    Modifier une formation existante
 * @access  Admin
 */
router.put('/formations/:id', upload.single('image'), async (req, res) => {
  try {
    const updatedData = req.body;
    if (req.file) {
      updatedData.imageUrl = req.file.path;
    }

    const updatedFormation = await Formation.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedFormation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    res.status(200).json({ message: "Formation mise à jour avec succès", formation: updatedFormation });
  } catch (err) {
    console.error("Erreur mise à jour formation :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @route   DELETE /api/formations/:id
 * @desc    Supprimer une formation
 * @access  Admin
 */
router.delete('/formations/:id', async (req, res) => {
  try {
    const deletedFormation = await Formation.findByIdAndDelete(req.params.id);
    if (!deletedFormation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    res.status(200).json({ message: "Formation supprimée avec succès" });
  } catch (err) {
    console.error("Erreur suppression formation :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});



// PUT - Modifier un témoignage
router.put('/temoignages/:id', async (req, res) => {
  try {
    const updatedData = req.body;
    const updatedTemoignage = await Temoignage.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedTemoignage) {
      return res.status(404).json({ message: "Témoignage non trouvé" });
    }

    res.status(200).json({ message: "Témoignage modifié avec succès", temoignage: updatedTemoignage });
  } catch (err) {
    console.error("Erreur modification témoignage :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE - Supprimer un témoignage
router.delete('/temoignages/:id', async (req, res) => {
  try {
    const deletedTemoignage = await Temoignage.findByIdAndDelete(req.params.id);
    if (!deletedTemoignage) {
      return res.status(404).json({ message: "Témoignage non trouvé" });
    }

    res.status(200).json({ message: "Témoignage supprimé avec succès" });
  } catch (err) {
    console.error("Erreur suppression témoignage :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});














module.exports = router;


