const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  titre: String,
  slug: { type: String, unique: true },
  accroche: String, // ✅ Phrase d’appel à l’action (ex : "Rejoignez-nous maintenant !")
  description: String,
  imageUrl: String,
  videoUrl: String,
  prix: Number,
  duree: String, // ✅ Nouveau champ
  niveau: String,      // ← Ajouté
  categorie: String,   // ← Ajouté
  dateDebut: Date,     // ← Ajouté
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Formation', formationSchema);
