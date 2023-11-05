**Interface admin**. 

# modèle de données
Users: 
- username:String (unique)
- prenom:String
- nom:String
- password:String (mot de passe)
- superutilisateur:Boolean
- mail:String
- nomVoie:String
- numVoie:String
- complementVoie:String
- codePostal:String
- commune:String
- iban:String
- bic:String
- resetPasswordToken:String
- resetPasswordExpires:String
- services:{
	role:String,
	nom:String
	}

Factures: 
- tva : Number
- totalTtc: Number
- totalHt: Number
- crediteur: String
- dateAchat: Date
- idUtilisateur: String
- service:String
- categorie: string

Services:
- Service:String


# Lancer le projet 

- avoir un service mongo tournant sur localhost:27017.  
(l'ip "localhost" peut être changée via le fichier back/.env.dev)

- injecter les données initiales dans la BD :
```bash
cd back
npm i
npm run dev-init
```

- lancer le backend dans une console : 
```bash
cd back
npm i
npm run dev
```

## Auteurs

* AGREBI Jihene
* AHMED Saad El Din
* BEN EL BEY Yessine
* NORTIER Hugo
