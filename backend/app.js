// Importation des modules nécessaires
require('dotenv').config();               // Charge les variables du fichier .env
const express = require('express');       // Framework web
const mongoose = require('mongoose');     // Pour interagir avec MongoDB
const bodyParser = require('body-parser');// Pour lire les données envoyées en POST
const path = require('path');             // Pour gérer les chemins de fichiers
const bcryptjs = require('bcryptjs');
const Admin = require('./models/Admins'); // Assure-toi que ce chemin est correct

require('dotenv').config();



// Création de l'application Express
const app = express();



// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use('/img', express.static('public/img'));
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/img', express.static(path.join(__dirname, '../public/img')));

app.use(express.static(path.join(__dirname, '../public')));

// Routes API
const adminRoutes = require('./routes/api');
app.use('/api', adminRoutes);


// Connexion à MongoDB avec Mongoose
mongoose.connect(process.env.MONGO_URI).then(() => console.log(" Connecté à MongoDB"))
  .catch((err) => console.error("Erreur MongoDB :", err));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true })); // Pour lire les données des formulaires
app.use(bodyParser.json());                         // Pour lire les données JSON
app.use(express.static(path.join(__dirname, 'public'))); // Dossier public pour les fichiers HTML/CSS/JS








// Fonction pour créer l'admin une seule fois (à exécuter manuellement si besoin)
async function createAdmin() {
  try {
    const existing = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (existing) return console.log("❗ Admin déjà existant.");

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

// Décommente ceci UNE FOIS pour créer l’admin
createAdmin()












// Routes API (on ajoutera le fichier plus tard)
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Route API pour les inscription
const inscriptionRoute = require('./routes/api');
app.use('/api', inscriptionRoute);
app.use('/api/inscriptions', require('./routes/api'));




// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
