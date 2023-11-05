var ObjectId = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
// Connection URL
const url = `mongodb://${process.env.API_URL}:27017/ndfBackOffice`;
exports.connexionMongo = async () => {
  mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  return db;
};

exports.login = async (mail, password) => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;

  try {
    let myquery = { mail: mail };

    let data = await db.collection("users").findOne(myquery);
    const hash = await bcrypt.hash(password, 10);
    if (!data) {
      reponse = {
        succes: false,
        login: false,
        error: null,
        msg: "aucun user",
      };
    } else {
      if (data.password == hash) {
        reponse = {
          succes: false,
          login: true,
          error: null,
          msg: "login",
        };
      } else {
        reponse = {
          succes: false,
          login: false,
          error: null,
          msg: "wrong password",
        };
      }
    }
  } catch (err) {
    reponse = {
      succes: false,
      user: null,
      error: err,
      msg: "User non trouvé",
    };
  } finally {
    return reponse;
  }
};
exports.getUsers = async (userConnected) => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;
  let users;

  try {
    users = await db.collection("users").find().toArray();
    if (!users) {
      reponse = {
        status: 404,
        succes: false,
        msg: "aucun users",
        data: [],
      };
    } else {
      let servicesUserConnected = [];
      if (userConnected.superUtilisateur!=undefined && (userConnected.superUtilisateur==="true" || userConnected.superUtilisateur===true)) {
        let reqServices = await db.collection("services").find().toArray();
        for (let i = 0; i < reqServices.length; i++)
          servicesUserConnected.push(reqServices[i].service)
      }
      else {
        userConnected.services.forEach(element => {
          if (element.role == "gestionnaire")
            servicesUserConnected.push(element.nom);
        });
      }
      let usersRes = []

      for (let i = 0; i < users.length; i++) {
        const found = users[i].services.some(r => servicesUserConnected.indexOf(r.nom) >= 0)
        if (found)
          usersRes.push(users[i])
      }
      if (usersRes.length==0) {
        reponse = {
          status: 404,
          succes: false,
          msg: "aucun users",
          data: [],
        };
      }
      else {
        // TODO si userCOnnected gestionnaire et user listé est gestionnaire
        reponse = {
          status: 200,
          succes: true,
          msg: "users recherchés avec succès",
          data: usersRes,
        };
      }

    }
  } catch (err) {
    reponse = {
      status: 500,
      succes: false,
      error: err,
      msg: "erreur lors du find des users",
    };
  } finally {
    //client.close();
    return reponse;
  }
};

exports.getUsersAll = async () => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;
  let users;

  try {
    users = await db.collection("users").find().toArray();
    if (!users) {
      reponse = {
        status: 404,
        succes: false,
        msg: "aucun users",
        data: [],
      };
    }
    else {
      // TODO si userCOnnected gestionnaire et user listé est gestionnaire
      reponse = {
        status: 200,
        succes: true,
        msg: "users recherchés avec succès",
        data: users,
      };
    }
  } catch (err) {
    reponse = {
      status: 500,
      succes: false,
      error: err,
      msg: "erreur lors du find des users",
    };
  } finally {
    //client.close();
    return reponse;
  }
};

exports.getUserByMail = async (mail) => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;

  try {
    let myquery = { mail: mail };

    let data = await db.collection("users").findOne(myquery);
    if (!data) {
      reponse = {
        succes: false,
        user: null,
        error: null,
        msg: "aucun user",
      };
    } else {
      reponse = {
        succes: true,
        user: data,
        error: null,
        msg: "User trouvé",
      };
    }
  } catch (err) {
    reponse = {
      succes: false,
      user: null,
      error: err,
      msg: "User non trouvé",
    };
  } finally {
    return reponse;
  }
};
exports.updateUser = async (id, formData) => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;

  try {
    let myquery = { _id: ObjectId(id) };
    let complementVoie = ""
    if (formData.complementVoie) {
      complementVoie = formData.complementVoie
    }
    let newvalues = {
      $set: {
        password: formData.password,
        mail: formData.mail,
        nom: formData.nom,
        prenom: formData.prenom,
        username: formData.prenom,
        nomVoie: formData.nomVoie,
        numVoie: formData.numVoie,
        codePostal: formData.codePostal,
        commune: formData.commune,
        iban: formData.iban,
        bic: formData.bic,
        complementVoie: complementVoie
        //services: formData.services
      },
    };
    let result = await db.collection("users").updateOne(myquery, newvalues);

    reponse = {
      succes: true,
      result: result,
      error: null,
      msg: "Modification réussie " + result,
    };
  } catch (err) {
    reponse = {
      succes: false,
      error: err,
      msg: "Problème à la modification",
    };
  } finally {
    return reponse;
  }
};
exports.deleteUser = async function (id, callback) {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;

  try {
    let myquery = { _id: ObjectId(id) };

    let result = await db.collection("users").deleteOne(myquery);
    reponse = {
      status: 204,
      succes: true,
      result: result,
      error: null,
      msg: "Suppression réussie " + result,
    };
  } catch (err) {
    reponse = {
      status: 500,
      succes: false,
      error: err,
      msg: "Problème à la suppression",
    };
  } finally {
    return reponse;
  }
};

exports.createFacture = async (formData) => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;
  var d = formData.dateAchat.split("/");
  var dateAchat = new Date(parseInt(d[2]), parseInt(d[1]) - 1, parseInt(d[0]), 14, 0, 0);
  try {
    let toInsert = {
      tva: parseFloat(formData.tva),
      totalTtc: parseFloat(formData.totalTtc),
      totalHt: parseFloat(formData.totalHt),
      crediteur: formData.crediteur,
      dateAchat: dateAchat,
      idUtilisateur: formData.idUtilisateur,
      service: formData.service,
      categorie: formData.categorie
    };
    await db.collection("factures").insertOne(toInsert);
    reponse = {
      succes: true,
      result: toInsert._id,
      msg: "Création réussie " + toInsert._id,
    };
  } catch (err) {
    reponse = {
      succes: false,
      error: err,
      msg: "erreur lors de la création",
    };
  } finally {
    return reponse;
  }
};
exports.getAllFactures = async (mailFacture, userConnected) => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;
  let factures;
  try {
    //requete toutes les factures
    if (mailFacture == null || mailFacture == undefined || mailFacture == "")
      factures = await db.collection("factures").find().sort({ "dateAchat": -1 }).toArray();
    //requete toutes les factures en filtrant par email
    else
      factures = await db.collection("factures").find({ idUtilisateur: mailFacture }).sort({ "dateAchat": -1 }).toArray();
    if (!factures) {
      reponse = {
        status: 404,
        succes: false,
        msg: "aucune facture de " + mail,
        data: [],
      };
    } else {
      let servicesUserConnected = [];
      if (userConnected.superUtilisateur!=undefined && (userConnected.superUtilisateur==="true" || userConnected.superUtilisateur===true)) {
        let reqServices = await db.collection("services").find().toArray();
        for (let i = 0; i < reqServices.length; i++)
          servicesUserConnected.push(reqServices[i].service)
      }
      else {
        userConnected.services.forEach(element => {
          if (element.role == "gestionnaire")
            servicesUserConnected.push(element.nom);
        });
      }
      index = factures.length - 1;
      while (index >= 0) {
        if (!servicesUserConnected.includes(factures[index].service)) {
          factures.splice(index, 1);
        }
        index -= 1;
      }
      reponse = {
        status: 200,
        succes: true,
        msg: "factures recherchées avec succès",
        data: factures,
      };
    }
  } catch (err) {
    reponse = {
      succes: false,
      error: err,
      msg: "erreur lors du la requête des factures",
    };
  } finally {
    return reponse;
  }
};
exports.getFactureByUser = async (ndfNeeded) => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;
  const { mail, startDate, endDate, service } = ndfNeeded;

  try {
    let myquery = { idUtilisateur: mail, service: service, dateAchat: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    let factures = await db.collection("factures").find(myquery).sort({ "dateAchat": -1 }).toArray();
    if (factures.length == 0) {
      reponse = {
        status: 404,
        succes: false,
        msg: "aucune facture de " + mail + " dans le service " + service + " avec ces dates.",
        data: [],
      };
    } else {
      reponse = {
        status: 200,
        succes: true,
        msg: "factures recherchées avec succès",
        data: factures,
      };
    }
  } catch (err) {
    reponse = {
      status: 500,
      succes: false,
      error: err,
      msg: "erreur lors du la requête des factures",
    };
  } finally {
    //client.close();
    return reponse;
  }
};
exports.getFacture = async (id) => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;

  try {
    let facture = await db.collection("factures").findOne({ _id: ObjectId(id) });
    if (!facture) {
      reponse = {
        status: 400,
        succes: false,
        msg: "aucune facture",
        data: null
      };
    } else {
      reponse = {
        status: 200,
        succes: true,
        msg: "facture recherchée avec succès",
        data: facture
      };
    }
  } catch (err) {
    reponse = {
      status: 404,
      succes: false,
      data: null,
      error: err,
      msg: "Facture non trouvée"
    };
  } finally {
    return reponse;
  }
};
exports.updateFacture = async (id, formData) => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;

  try {
    let myquery = { _id: ObjectId(id) };
    var dateAchat = new Date(formData.dateAchat);

    let newvalues = {
      $set: {
        tva: formData.tva,
        totalTtc: formData.totalTtc,
        totalHt: formData.totalHt,
        crediteur: formData.crediteur,
        dateAchat: dateAchat,
        idUtilisateur: formData.idUtilisateur,
        service: formData.service,
        categorie: formData.categorie
      },
    };
    let result = await db.collection("factures").updateOne(myquery, newvalues);
    reponse = {
      status: 204,
      succes: true,
      result: result,
      error: null,
      msg: "Modification réussie " + result,
    };
  } catch (err) {
    reponse = {
      status: 400,
      succes: false,
      error: err,
      msg: "Problème à la modification",
    };
  } finally {
    return reponse;
  }
};
exports.deleteFacture = async function (id, callback) {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;

  try {
    let myquery = { _id: ObjectId(id) };

    let result = await db.collection("factures").deleteOne(myquery);
    reponse = {
      succes: true,
      status: 204,
      result: result,
      error: null,
      msg: "Suppression réussie " + result,
    };
  } catch (err) {
    reponse = {
      status: 400,
      succes: false,
      error: err,
      msg: "Problème à la suppression",
    };
  } finally {
    return reponse;
  }
};
exports.createService = async (formData) => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;
  try {
    let toInsert = {
      service: formData.service
    };
    await db.collection("services").insertOne(toInsert);
    reponse = {
      succes: true,
      result: toInsert._id,
      msg: "Service " + toInsert.service + " créé. Id=" + toInsert._id,
    };
  } catch (err) {
    reponse = {
      succes: false,
      error: err,
      msg: "erreur lors de la création",
    };
  } finally {
    return reponse;
  }
};
exports.getServices = async () => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;
  let services;

  try {
    services = await db.collection("services").find().toArray();
    if (!services) {
      reponse = {
        succes: false,
        msg: "aucun service",
        data: [],
      };
    } else {
      reponse = {
        succes: true,
        msg: "service recherchée avec succès",
        data: services,
      };
    }
  } catch (err) {
    reponse = {
      succes: false,
      error: err,
      msg: "erreur lors du find des services",
    };
  } finally {
    //client.close();
    return reponse;
  }
};
exports.updateService = async (id, formData) => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;

  try {
    let myquery = { _id: ObjectId(id) };
    let newvalues = {
      $set: {
        service: formData.service,
      },
    };
    let result = await db.collection("services").updateOne(myquery, newvalues);
    reponse = {
      succes: true,
      result: result,
      error: null,
      msg: "Modification réussie " + result,
    };
  } catch (err) {
    reponse = {
      succes: false,
      error: err,
      msg: "Problème à la modification",
    };
  } finally {
    return reponse;
  }
};
exports.deleteService = async function (id, callback) {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;

  try {
    let myquery = { _id: ObjectId(id) };

    let result = await db.collection("services").deleteOne(myquery);
    reponse = {
      succes: true,
      result: result,
      error: null,
      msg: "Suppression réussie " + result,
    };
  } catch (err) {
    reponse = {
      succes: false,
      error: err,
      msg: "Problème à la suppression",
    };
  } finally {
    return reponse;
  }
};

exports.updatePasswordToken = async (mail, token, expires) => {
  console.log(token)
  console.log(mail)
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;
  /*const hash = await bcrypt.hash(token, 10);
  token = hash;*/
  try {
    let myquery = { mail: mail };
    let newvalues = {
      $set: {
        resetPasswordToken: token,
        resetPasswordExpires: expires
      },
    };
    let result = await db.collection("users").updateOne(myquery, newvalues);

    reponse = {
      succes: true,
      result: result,
      error: null,
      msg: "Modification réussie " + result,
    };
  } catch (err) {
    reponse = {
      succes: false,
      error: err,
      msg: "Problème à la modification",
    };
  } finally {
    return reponse;
  }
};
exports.updatePassword = async (mail, password) => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;
  const hash = await bcrypt.hash(password, 10);
  password = hash;
  try {
    let myquery = { mail: mail };
    let newvalues = {
      $set: {
        password: password,
      },
    };
    let result = await db.collection("users").updateOne(myquery, newvalues);
    reponse = {
      succes: true,
      result: result,
      error: null,
      msg: "Modification réussie " + result,
    };
  } catch (err) {
    reponse = {
      succes: false,
      error: err,
      msg: "Problème à la modification",
    };
  } finally {
    return reponse;
  }
};
exports.getUserGestionnaireService = async (mail) => {
  await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  let reponse;

  try {
    let myquery = { mail: mail };
    let data = await db.collection("users").findOne(myquery);
    let tabServicesGestionnaire = []
    let counter = 0
    while (data == null && counter <= 10000) {
      counter++
        ;;
    }
    if (data.superUtilisateur!=undefined && (data.superUtilisateur==="true" || data.superUtilisateur===true)) {
      let reqServices = await db.collection("services").find().toArray();
      for (let i = 0; i < reqServices.length; i++)
        tabServicesGestionnaire.push(reqServices[i].service)
    }
    else {
      for (let i = 0; i < data.services.length; i++) {
        if (data.services[i].role.toLowerCase() == "gestionnaire") {
          tabServicesGestionnaire.push(data.services[i].nom);
        }
      }
    }

    if (!data) {
      reponse = {
        succes: false,
        user: null,
        error: null,
        msg: "aucun user",
      };
    } else {
      reponse = {
        succes: true,
        services: tabServicesGestionnaire,
        error: null,
        msg: "Services dont l'utilisateur est gestionnaire",
      };
    }
  } catch (err) {
    reponse = {
      succes: false,
      user: null,
      error: err,
      msg: "User non trouvé",
    };
  } finally {
    return reponse;
  }
};