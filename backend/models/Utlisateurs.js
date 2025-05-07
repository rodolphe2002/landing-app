const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  nom: String,
  Whatsapp: String,
  formation: String,
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);
module.exports = Utilisateur;
