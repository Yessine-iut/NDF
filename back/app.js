const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const server = require("http").Server(app);
const crypto = require("crypto");
const mongoDBModule = require("./connectToMongoDb");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
var multer = require("multer");
var multerData = multer();
const { promisify } = require("util");
const nodemailer = require("nodemailer");
const passport = require("passport");
const secureRoute = require("./routes");
var ObjectId = require("mongodb").ObjectID;
require("./auth/auth");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
let tokensHm = new Map();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  next();
});

app.options("/*", (_, res) => {
  res.sendStatus(200);
});

// Lance le serveur avec express
server.listen(port);
console.log(process.env.API_URL)
console.log("Serveur lancé sur le port : " + port);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tpagroupe2@gmail.com",
    pass: "lnmzatdioifktsxb",
  },
});

app.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    if (res.message == "Vous avez déjà un compte, connectez-vous") {
      res.status(409).send("Vous avez déjà un compte, connectez-vous");
    } else
      res.json({
        status: 200,
        message: "Signup successful",
        user: req.user,
      });
  }
);

app.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        res.status(403);
        res.send("Password false, try again");
        return;
        /*const error = new Error('Password false, try again');
        return next(error);*/
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = { _id: user._id, email: user.mail };
        const token = jwt.sign({ user: body }, "TOP_SECRET");
        //while (tokensHm.values().remove(user.email));
        tokensHm.set(token, user.mail);
        return res.json({ token, user });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});
// retourne tous les users
app.get("/api/users", (req, res) => {
  var userConnected = req.query.user;
  mongoDBModule.getUsers(userConnected).then((data) => {
    res.send(JSON.stringify(data));
  });
});
app.use(
  "/api/user/:mail",
  passport.authenticate("jwt", { session: false }),
  secureRoute
);
app.get("/api/user/:mail", (req, res) => {
  var mail = req.params.mail;
  let mailRequeteur = tokensHm.get(req.query.secret_token);
  let services;
  mongoDBModule.getUserGestionnaireService(mailRequeteur).then((data) => {
    services = data.services;
    mongoDBModule.getUserByMail(mail).then((data2) => {
      for (let i = 0; i < data2.user.services.length; i++) {
        if (services.includes(data2.user.services[i].nom)) {
          res.send(JSON.stringify(data2));
          return;
        }
      }
      res
        .status(401)
        .send("Vous n'êtes pas gestionnaire du service de cet utilisateur");
      return;
      //Vérification
    });
  });
});
app.use(
  "/api/user/:id",
  passport.authenticate("jwt", { session: false }),
  secureRoute
);
app.put("/api/user/:id", multerData.fields([]), (req, res) => {
  var id = req.params.id;
  mongoDBModule.updateUser(id, req.body).then((data) => {
    res.send(JSON.stringify(data));
  });
});
app.use(
  "/api/user/",
  passport.authenticate("jwt", { session: false }),
  secureRoute
);
app.delete("/api/user/:id", (req, res) => {
  var id = req.params.id;
  mongoDBModule.deleteUser(id).then((data) => {
    res.send(JSON.stringify(data));
  });
});

app.use(
  "/api/factures/",
  passport.authenticate("jwt", { session: false }),
  secureRoute
);
app.post("/api/factures", (req, res) => {
  let body = req.body;
  mongoDBModule.createFacture(body).then((data) => {
    res.send(JSON.stringify(data));
  });
});

app.get("/api/allFactures/", (req, res) => {
  var mailFacture = req.query.mail;
  var userConnected = req.query.user;
  mongoDBModule.getAllFactures(mailFacture, userConnected).then((data) => {
    res.send(JSON.stringify(data));
  });
});
app.post("/api/factureByUser", (req, res) => {
  mongoDBModule.getFactureByUser(req.body).then((data) => {
    res.send(JSON.stringify(data));
  });
});
/*app.get('/api/factureByDate/:date', (req, res) => {
  var date = req.params.date;
  mongoDBModule.getFactureByDate(date)
    .then(data => {
      res.send(JSON.stringify(data));
    });
});*/
app.use(
  "/api/facture/:id",
  passport.authenticate("jwt", { session: false }),
  secureRoute
);
app.put("/api/facture/:id", multerData.fields([]), (req, res) => {
  var id = req.params.id;
  mongoDBModule.updateFacture(id, req.body).then((data) => {
    res.send(JSON.stringify(data));
  });
});
app.delete("/api/facture/:id", (req, res) => {
  var id = req.params.id;
  mongoDBModule.deleteFacture(id).then((data) => {
    res.send(JSON.stringify(data));
  });
});
app.get("/api/facture/:id", (req, res) => {
  var id = req.params.id;
  mongoDBModule.getFacture(id).then((data) => {
    res.send(JSON.stringify(data));
  });
});
app.get("/api/services", (req, res) => {
  mongoDBModule.getServices().then((data) => {
    res.send(JSON.stringify(data));
  });
});
app.use(
  "/api/services/",
  passport.authenticate("jwt", { session: false }),
  secureRoute
);
app.post("/api/services", (req, res) => {
  let body = req.body;
  mongoDBModule.createService(body).then((data) => {
    res.send(JSON.stringify(data));
  });
});
app.use(
  "/api/service/:id",
  passport.authenticate("jwt", { session: false }),
  secureRoute
);
app.put("/api/service/:id", multerData.fields([]), (req, res) => {
  var id = req.params.id;
  mongoDBModule.updateService(id, req.body).then((data) => {
    res.send(JSON.stringify(data));
  });
});
app.delete("/api/services/:id", (req, res) => {
  var id = req.params.id;
  mongoDBModule.deleteService(id).then((data) => {
    res.send(JSON.stringify(data));
  });
});

app.post("/forgot", async (req, res, next) => {
  const token = (await promisify(crypto.randomBytes)(20)).toString("hex");
  const user = mongoDBModule.getUserByMail(req.body.mail);

  if (!user) {
    console.log("error, No account with that email address exists.");
    res.send(
      JSON.stringify("error, No account with that email address exists.")
    );
    //return res.redirect('/forgot');
  }
  /*user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;*/
  mongoDBModule.updatePasswordToken(req.body.mail, token, Date.now() + 3600000);
  var mailOptions = {
    from: "",
    to: req.body.mail,
    subject: "Réinitialisation du mot de passe",
    text: `Vous recevez cet email car vous (ou une autre personne) avez demandé la réinitialisation du mot de passe pour votre compte.
    Veuillez cliquer sur le lien suivant ou le copier-coller dans votre navigateur pour terminer le processus:
		http://${process.env.API_URL}:3000/resetpassword/?token=${token}
		Si vous n'avez pas effectué cette demande, veuillez ignorer cet email et votre mot de passe restera inchangé.`,
  };
  //${req.headers.host}
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send(JSON.stringify(error));
    } else {
      console.log("Email sent: " + info.response);
      res.send(JSON.stringify("Email sent: " + info.response));
    }
  });
});
app.post("/reset/:token", async (req, res) => {
  mongoDBModule.getUsersAll().then((data) => {
    let reponse;
    const user = data.data.find(
      (u) =>
        u.resetPasswordExpires > Date.now() &&
        crypto.timingSafeEqual(
          Buffer.from(u.resetPasswordToken),
          Buffer.from(req.params.token)
        )
    );
    if (!user) {
      reponse = {
        succes: false,
        msg: "Password reset token is invalid or has expired.",
        status: 405,
      };
      //res.sendStatus(405);
      res.send(JSON.stringify(reponse));
      return;
      //return res.redirect('/forgot');
    }
    mongoDBModule.updatePassword(user.mail, req.body.password);
    mongoDBModule.updatePasswordToken(user.mail, user.password, Date.now());
    const resetEmail = {
      to: user.mail,
      from: "passwordreset@example.com",
      subject: "Votre mot de passe a été modifié.",
      text: `
      Ceci est une confirmation que le mot de passe pour votre compte "${user.mail}" a été modifié.
				`,
    };
    transporter.sendMail(resetEmail, function (error, info) {
      if (error) {
        console.log(error);
        res.send(JSON.stringify(error));
      } else {
        console.log("Email sent: " + info.response);
        reponse = {
          succes: true,
          msg: `Success! Your password has been changed.`,
        };
        res.send(JSON.stringify(`Success! Your password has been changed.`));
      }
    });
  });
});

app.get("/api/allemailssameservice/:mail", (req, res) => {
  let mailRequeteur = req.params.mail;
  if (mailRequeteur === null || mailRequeteur === undefined) res.status(400).send("User non connecté");
  let servicesUserConnected;
  let emails = [];
  let servicesEnCommun = [];
  mongoDBModule.getUserByMail(mailRequeteur).then((data2) => {
    let reqUser = data2.user
    mongoDBModule.getUserGestionnaireService(mailRequeteur).then((data) => {
      servicesUserConnected = data.services;
      mongoDBModule.getUsers(reqUser).then((users) => {
        users.data.forEach(user => {
          user.services.forEach(service => {
            if (servicesUserConnected.includes(service.nom) || reqUser.superUtilisateur) {
              emails.push(user.mail);
              servicesEnCommun.push(service.nom);
            }
          })
        });

        emails = emails.filter((item, index) => emails.indexOf(item) === index); //retire les doublons
        servicesEnCommun = servicesEnCommun.filter((item, index) => servicesEnCommun.indexOf(item) === index); //retire les doublons
        res.send(JSON.stringify([emails, servicesEnCommun]));
      });
    });
  });

});