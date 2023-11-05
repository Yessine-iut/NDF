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
const Service = new Schema({
  service: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('service', Service, 'services');