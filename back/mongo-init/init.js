const User = require('../user');
const Service = require('../service');
const Facture = require('../facture');

console.log(`Init : ${process.env.API_URL}`)
let user1 = new User({prenom: 'Yessine',nom:"BEN EL BEY",username:"Yessine",superUtilisateur:false,mail:"yessine.ben-el-bey@etu.unice.fr",password:"test",nomVoie:"Henri sappia",numVoie:"84",complementVoie:"Bat 7 esc 4",codePostal:"06100",commune:"Nice",iban:"FR7630001007941234567890185",bic:"AGRIFRPP847",resetPasswordToken:"test",services:[{role:"utilisateur",nom:"MIAGE"}],resetPasswordExpires:Date.now()});
let user2 = new User({prenom: 'Saad',nom:"AHMED",username:"Saad",superUtilisateur:false,mail:"saad.ahmed@etu.unice.fr",password:"test",nomVoie:"Henri sappia",numVoie:"84",complementVoie:"Bat 7 esc 4",codePostal:"06100",commune:"Nice",iban:"FR7630004000031234567890143",bic:"AGRIFRPP847",resetPasswordToken:"test",services:[{role:"gestionnaire",nom:"MIAGE"}],resetPasswordExpires:Date.now()});
let user3 = new User({prenom: 'Hugo',nom:"NORTIER",username:"Hugo",superUtilisateur:true,mail:"hugo.nortier@etu.unice.fr",password:"test",nomVoie:"Henri sappia",numVoie:"84",complementVoie:"Bat 7 esc 4",codePostal:"06100",commune:"Nice",iban:"FR7630006000011234567890189",bic:"AGRIFRPP847",resetPasswordToken:"test",services:[{role:"utilisateur",nom:"Polytech"}],resetPasswordExpires:Date.now()});

let service = new Service({service: 'MIAGE'});
let service2 = new Service({service: 'Polytech'});

let facture = new Facture({ tva: 1.4, totalTtc: 2, totalHt: 1.33,crediteur:"562041525",dateAchat:"2023-01-17T13:00:00.000Z",idUtilisateur:"yessine.ben-el-bey@etu.unice.fr",service:"MIAGE",categorie:"transports"})
let facture2 = new Facture({ tva: 1.4, totalTtc: 2, totalHt: 1.33,crediteur:"562041525",dateAchat:"2023-02-17T13:00:00.000Z",idUtilisateur:"saad.ahmed@etu.unice.fr",service:"MIAGE",categorie:"hebergement"})

  user1.save((err) => {
    if (err) return handleError(err);
  });
  user2.save((err) => {
    if (err) return handleError(err);
  });
  user3.save((err) => {
    if (err) return handleError(err);
  });
  service.save((err) => {
    if (err) return handleError(err);
  });
  service2.save((err) => {
    if (err) return handleError(err);
  });
  facture.save((err) => {
    if (err) return handleError(err);
  });

  facture2.save((err) => {
    if (err) return handleError(err);
  });

  const handleError = function(err) {
    console.error(err);
};

setTimeout(()=>{
  process.exit(0)
},5000)