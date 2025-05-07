const mongoose = require('mongoose');

const temoignageSchema = new mongoose.Schema({
  nomClient: String,
  message: String,
  avatar: String, // Image du client
  formationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Formation',  // Lien vers le modèle Formation
    required: true      // Formation associée au témoignage
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Temoignage', temoignageSchema);
