// dependencies
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');
// connect to database
mongoose.connect(`mongodb://${process.env.API_URL}/ndfBackOffice`,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// Create Model
const Schema = mongoose.Schema;
const User = new Schema({
  mail: {
    type: String,
    required: true,
    unique: true
  },
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  nomVoie:{
    type:String,
    required: true
  },
  numVoie:{
    type:String,
    required: true
  },
  complementVoie:{
    type:String,
  },
  codePostal:{
    type:String,
    required: true
  },
  commune:{
    type:String,
    required: true
  },
  iban:{
    type:String,
    required: true
  },
  bic:{
    type:String,
    required: true
  },      
  services:[
    {
      nom:String,
      role:String
    }
  ],
  superUtilisateur:{
    type:Boolean,
    required:false
  },
  resetPasswordToken:{
    type:String,
    required:true
  },
  resetPasswordExpires:{
    type:String,
    required:true
  },           
});
User.pre(
  'save',
  async function(next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
    this.resetPasswordToken =hash
    next();
  }
);
User.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
}

// Export Model
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User, 'users');
