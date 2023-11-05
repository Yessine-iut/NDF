const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../user');
const mongoose = require("mongoose");
const url = `mongodb://${process.env.API_URL}:27017/ndfBackOffice`;

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
passport.use(
    'signup',
    new localStrategy(
      {
        usernameField: 'mail',
        passwordField: 'password',
        passReqToCallback : true,
      },
      async (req,mail, password, done) => {
        try {         
          let nom= req.body.nom;
          let prenom= req.body.prenom;
          let username=req.body.mail;
          let nomVoie=req.body.nomVoie;
          let numVoie=req.body.numVoie;
          let complementVoie=req.body.complementVoie;
          let codePostal=req.body.codePostal;
          let commune=req.body.commune;
          let iban=req.body.iban;
          let bic=req.body.bic;
          let services=req.body.services;
          let resetPasswordToken=password;
          let resetPasswordExpires=Date.now();
          await mongoose.createConnection(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          const db = mongoose.connection;        
          try {
            let myquery = { mail: username };
            let data = await db.collection("users").findOne(myquery);
            if (!data) {
              const user = await UserModel.create({mail, nom,prenom,username,password,nomVoie,numVoie,complementVoie,codePostal,commune,iban,bic,services,resetPasswordToken,resetPasswordExpires});
              return done(null, user);
            } else {
              done("Vous avez déjà un compte, connectez vous.")
            }
          }catch (err) {
            done(err);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
passport.use(
    'login',
    new localStrategy(
      {
        usernameField: 'mail',
        passwordField: 'password'
      },
      async (mail, password, done) => {
        try {
          const user = await UserModel.findOne({ mail });
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
  
          const validate = await user.isValidPassword(password);
  
          if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
          }
  
          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
passport.use(
    new JWTstrategy(
      {
        secretOrKey: 'TOP_SECRET',
        jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    )
  );