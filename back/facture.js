// dependencies
const mongoose = require('mongoose');
// connect to database
mongoose.connect(`mongodb://${process.env.API_URL}/ndfBackOffice`,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// Create Model
const Schema = mongoose.Schema;
const Facture = new Schema({
  tva: {
    type: Number,
    required: true,
  },
  totalTtc: {
    type: Number,
    required: true,
  },
  totalHt: {
    type: Number,
    required: true,
  },
  crediteur: {
    type: String,
    required: true
  },
  dateAchat: {
    type: Date,
    required: true
  },
  idUtilisateur: {
    type: String,
    required: true
  },
  service:{
    type:String,
    required:true
  },
  categorie:{
    type:String,
    required:true
  }

});



// Export Model

module.exports = mongoose.model('facture', Facture, 'factures');
