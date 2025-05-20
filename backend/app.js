// Chargement des variables d'environnement
require('dotenv').config();

// Modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bcryptjs = require('bcryptjs');
const Admin = require('./models/Admins');

// Initialisation de l'app
const app = express();

// Middleware pour les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Middlewares de parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("Erreur MongoDB :", err));

// Création de l’admin (si non existant)
async function createAdmin() {
  try {
    const existing = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (existing) return console.log("Admin déjà existant.");

    const hashedPassword = await bcryptjs.hash(process.env.ADMIN_PASSWORD, 10);
    const admin = new Admin({
      username: process.env.ADMIN_USERNAME,
      password: hashedPassword
    });

    await admin.save();
    console.log('Admin créé avec succès !');
  } catch (err) {
    console.error('Erreur création admin :', err);
  }
}
createAdmin(); // exécuter une seule fois

// Routes API
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
