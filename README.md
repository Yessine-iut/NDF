# NDF APP 

**Gestionnaire de notes de frais.**  
Compte-rendu des réunions avec M.Galli et récapitulatif du travail effectué chaque semaine.  
Pour des informations sur les applications développées. Se référer aux readme dans les sous-dossiers.  

## Membres du groupe
* AGREBI Jihenne
* AHMED Saad El Din
* BEN EL BEY Yessine
* NORTIER Hugo

## Contexte projet et travail attendu
Les gestionnaires de l’université doivent effectuer des notes de frais (NDF) à la main chaque mois à partir des factures de chaque collaborateur.  
L’objectif est de les aider et alléger leur travail en mettant en place un outil de gestion de NDF.  
L’outil possédera un backoffice web utilisé par les gestionnaires (admin) qui leur permettra de gérer les utilisateurs et leurs factures ainsi que générer des NDF. Ces données seront stockées par une BD que l’on accèdera par une API REST.  
On aura aussi une app mobile qui permettra aux collaborateurs (user) de scanner leurs factures.  
Les factures seront ensuite passées à travers un OCR qui sera en charge de retrouver les infos clés telles que : date facture, € HT, € TTC, TVA totale (5.5, 10, 20), catégorie (ex : restauration).  
On pourrait envisager de donner la possibilité aux gestionnaires de modifier les infos retrouvées par l’OCR si celles-ci se révèlent erronées.  
Il faudra enfin prévoir un mode admin pour l’appli mobile qui permet aux gestionnaires de scanner une facture pour n’importe quel collaborateur.  

## Compte-rendu 
### Compte-rendu réunion du 17/01/2023
Réunion de démarrage du projet où nous avons discuté avec M.Galli du contexte du projet et il nous a expliqué en détail ce qui est attendu.

### Travail effectué semaine du 23/01/2023
Cette semaine, nous nous sommes focalisés sur de la documentation et la mise en place de notre architecture :
- Nous avons mis à plat l'architecture et les technos que nous allons utiliser.
- Nous nous sommes documentés sur les domaines de computer vision et machine/deep learning appliqués à notre cas d'utilisation.
- Nous avons analysé les différentes bibliothèques ocr sur internet pour voir laquelle est la plus intéressante pour nous.
- Nous avons listé les différents use case pour nos applications.
- Nous avons revu le travail des étudiants des années précédentes pour voir ce qui peut être repris.

### Compte-rendu réunion du 31/01/2023
Pendant cette réunion, nous avons montré à M.Galli le début de codes de nos applications. Nous lui avons montré le backend de notre architecture en nodeJS, nous lui avons aussi montré le début de OCR qui retrouve les infos clés par une approche algorithmique.    
Le professeur nous a fait remarquer que l'on pourrait extraire plus d'infos intéressantes comme le nom d'entreprise si le siret n'est pas disponible, et envoyer en retour du ocr une image avec le texte retrouvé mis en valeur sur l'image.

### Travail effectué semaine du 30/01/2023
#### AGREBI Jihene
J'ai commencé la partie mobile avec Yessine. L'application, etant en kotlin, elle permet de lancer la camera du telephone pour prendre nos factures en photo. 
La fonction retourne une image qui va etre envoyer à l'api OCR via une requete post.
L'objectif de la semaine prochaine est de faire la communication entre l'ocr et l'app mobile.
#### AHMED Saad El Din
J'ai demarré la partie ocr. J'ai utilisé python comme langage et je suis passé par le framework Django pour pouvoir créer une api.    
En ce qui concerne l'ocr, j'ai utilisé EasyOCR, cette bibliothèque nous permet de connaitre la position exacte du texte retrouvé sur l'image, ainsi cela m'a permis de sortir les infos clés avec une approche algorithmique où je vérifie la position de chaque donnée et j'en déduis si c'est la bonne info ou pas (ex: la valeur de HT/TVA/TTC se trouve presque toujours à droite ou en bas de la mention). J'ai aussi mis en place un système qui calcule les chiffres manquants à partir de celles trouvées s’il n’y en a pas sur l'image.  
Il est déjà possible d'appeler l'OCR avec une requête http post contenant l'image dont on veut extraire les infos et on recevra en retour un json avec les informations retrouvées ainsi que leur position sur l'image.  

#### BEN EL BEY Yessine
Tout d'abord, durant la semaine j'ai crée une base de données sur mongoDB ayant pour table "Factures" et "Utilisateurs".
La table "Factures" a pour champs: tva, totalTtc, totalHt, entreprise, dateAchat, idUtilisateur.
La table "Utilisateurs" a pour champs: prenom, nom, mail, password, role.
J'ai également travaillé sur le back-end du site web admin (backoffice) à développer. Le langage utilisé est nodeJs.
Les requêtes principales ont été faites (GET,POST,PUT,DELETE) pour un utilisateur et une facture.
Il y a également des requetes GET plus spécifiques telles que la méthode factureByUser, qui permet d'avoir les factures d'un utilisateur.
De plus, il y a les requêtes d'authentification (login,signUp) qui ont été faites.

J'ai avancé sur la partie application mobile avec Jihene.
L'objectif est de mettre un bouton permettant au clic d'allumer la caméra du téléphone pour qu'on puisse prendre une photo.
Après la prise en photo il faut la stocker dans une variable pour qu'on puisse l'envoyer à l'OCR.


#### NORTIER Hugo
Je fus en convalescence durant cette semaine mais pour autant, j'ai effectué des recherches sur l'OCR et j'ai constitué une base de données de tickets de caisse ainsi que de factures pour entraîner ultérieurement l'OCR.  

### Travail effectué semaine du 06/02/2023
#### AGREBI Jihene
#### AHMED Saad El Din
Cette semaine j'ai optimisé l'OCR, notamment j'ai fait en sorte qu'on puisse recevoir en retour l'image scannée avec les elements retrouvés marqués dessus. Cette image est renvoyée sous forme de base64. Pour palier aux problèmatiques de taille trop elevée, l'image est toujours 1000x1000.
#### BEN EL BEY Yessine
Cette semaine j'ai ajouté des requêtes qui sont liées à l'oubli du mot de passe. On peut maintenant changer son mot de passe grâce à un token provisoire qui sera envoyé par mail.
J'ai changé la base de données. J'ai dû ajouter la table service et toutes les requetes basiques pour un service(GET,PUT,POST,DELETE).
La table user a été modifié, on a maintenant un tableau nommé "services" et chaque enfant de ce tableau a un nom et un
rôle (correspondant au rôle de l'utilisateur dans ce service). J'ai ajouté les attributs "resetPasswordToken", qui par défaut aura la valeur du "password".
Cet attribut va nous servir a donné un token de courte durée à l'utilisateur lors d'un oubli d'un mot de passe.
Puis on a également l'attribut "resetPasswordExpires", qui lui va servir à savoir si le token qu'on a généré est expiré ou non. C'est une date, qui est la date de la génération du token. 

J'ai corrigé plusieurs bugs au niveau du front-end qui sont:  
	  - Au clic du bouton on pouvait pas changer le mode de visibilité du password.  
	  - Le menu déroulant des services qui n'affichaient pas tous les services.
	
J'ai également avancé sur la partie android avec Jihene, on a fait un refactoring du projet pour passer des fragments aux activités. Nous avons également fait un formulaire
pour afficher la réponse de l'OCR (le formulaire reste à compléter).
#### NORTIER Hugo
Je fus également en convalescence mais:  
J'ai enrichi la Base de données de tickets de caisse et de factures pour entraîner l'OCR avec beaucoup de cas distincts de tickets/factures.  
J'ai réalisé le front-end en React en utilisant axios pour les requêtes au backend Node et [ChakraUI](https://chakra-ui.com/getting-started) pour le visuel.  
Ainsi, nous pouvons créer un compte, se connecter, récupérer un mot de passe perdu et le réinitialiser, créer des services, accéder à la page d'accueil.  
Il y a un footer et une navbar. Il y a un mode sombre (dark mode) et un mode éclairé (light mode). 
ChakraUI permet automatiquement la création de composant "responsive" pour avoir un site web réactif.  

J'ai vraiment cherché à respecter les critères ergonomiques afin d'avoir une souplesse combinée avec une robustesse de l'interaction homme machine.  
Ainsi, on va retrouver entre autres des messages d'erreur ou de succès affichés explicitement à l'utilisateur. On prévient les erreurs de l'utilisateur etc.  

### Travail effectué semaine du 13/02/2023
#### AHMED Saad El Din
Cette semaine, j'ai repris l'application mobile et j'ai mis en place un système de login. Je demande à travers une page de login aux utilisateurs de se connecter et une fois la connection effectéue, je stock leur token et je l'utilise pour verifier s'ils sont bien connectés et leur donner accès à la page de scan de factures.

### Travail effectué semaine du 20/02/2023
#### AHMED Saad El Din
Cette semaine, j'ai essayé de deployer notre architecture sur des solutions internet, notamment l'ocr qui est necessaire à l'application mobile pour marcher. Cependant les plans gratuits proposés par les sites comme Render ne se sont pas averés suffisants pour la puissance de calcul demandée par l'ocr et ce travail n'a pas abouti à notre solution étant deployée.

### Travail effectué semaine du 27/02/2023
#### AHMED Saad El Din
J'ai repris le mobile et je l'ai mis à jour pour qu'il puisse enfin effectuer une rêquete vers l'ocr et traiter le résultat retourné. Le résultat sera affiché dans un formulaire qui pourra être modifié par l'utilisateur s'il le souhaite. Il aura aussi un onglet qui lui permettra de voir l'image retournée par le back. S'il est content de la facture, ensuite l'utilisateur pourra sauvegarder la facture dans la base de données du back.
#### NORTIER Hugo
Avec Yessine on a vu au niveau du backend node.js pour faire en sorte qu'un gestionnaire ne puisse accéder qu'aux factures des utilisateurs du même service que le gestionnaire.  
J'ai ajouté la dépendance 'validator' qui possède des méthodes de validations de string telles que "isPostalCode", "isIBAN", "isBIC", "isEmail", "isInteger" etc.  
J'ai refactorisé le formulaire "Register" en mettant en place des validations et la possibilité d'ajouter des services/role dnas le service.  
Le compte peut être créé à 100% avec le formulaire.
#### BEN EL BEY Yessine
J'ai géré les droits au niveau du back-end pour qu'un utilisateur ne puisse pas faire les mêmes requetes qu'un gestionnaire. J'ai dû changer la plupart des requêtes déjà existente en retrouvant un utilisateur grâce à son token en utilisant une hashMap.
### Travail effectué semaine du 06/03/2023
#### AHMED Saad El Din
J'ai ajouté des modifications pour le mobile et reglé certains bug majeurs, notamment j'ai decouvert que l'image envoyée à l'ocr était envoyée tournée de 90° ce qui faussait la majorité des résultats, j'ai donc reglé ce problème en utilisant une bibliothèque android conçue pour redresser les images.  
J'ai ensuite unifié le style de l'application et ses couleurs.
#### NORTIER Hugo
J'ai créé une requête dans le backoffice qui récupère les adresses mails des utilisateurs dont nous sommes gestionnaire de leur service.  
J'ai ajouté la dépendance react-pdf pour créer et afficher la NDF.  
J'ai fait le formulaire de création de NDF ainsi que sa requête dans le back qui prend en compte un utilisateur pour un service donnée et entre pour des factures entre 2 dates données.  
J'ai fait une requête getFactureByID ainsi que getAllFactures qui soit renvoie toutes les factures si aucun param sinon renvoie toutes les factures d'un users donné (sans se soucier de la date/ du service).  
J'ai listé les factures, permis de les supprimer et de les modifier.  
J'ai fait en sorte qu'un utilisateur connecté n'étant gestionnaire d'aucun service ne puisse pas accéder via la navbar aux pages "gestionnaire".  
Si un utilisateur est déjà connecté alors il verra "se déconnecter" dans la navbar et non pas "se connecter".  
J'ai créé un thème personnalisé (appelé "saumon") en React pour le plaisir et en apprendre davantage.
#### BEN EL BEY Yessine
J'ai finalisé la communication entre le back-end et l'android, ainsi que la récupération des données de l'OCR qui seront affichés dans un formulaire pour qu'ensuite l'utilisateur puisse modifier (s'il y a des erreurs de l'OCR) et envoyer le résultat au backend avec une requête POST pour créer une facture.
### Travail effectué semaine du 13/03/2023
#### AHMED Saad El Din
Cette semaine, j'ai demarré le rapport final de TPI.  
J'ai touché ensuite à l'application web (back et front) pour mettre en place un super utilisateur qui pourra tout faire (pour avoir quelqu'un qui puisse créer des services). J'ai fait en sorte que chaque rêquete n'aie pas de filtre par rapport aux droits si c'est un super utilisateur qui l'effectue (on aura donc toujours tous les résultats)
#### NORTIER Hugo
Rapport du TPI.    
J'ai refusé l'accès aux pages pour les personnes non gestionnaire.  
Je ne liste plus que les factures des services où l'on est gestionnaire.  
On peut filtrer les factures par utilisateur du même service où nous sommes gestionnaire.  
J'ai listé les utilisateurs des services où nous sommes gestionnaire et permis de les supprimer.    
Dans la step 2 du formulaire de création de compte, les services listés dans le select input sont maintenant issues de la base de données (au lieu d'être en brut). 
#### BEN EL BEY Yessine
J'ai ajouté un attribut super utilisateur pour pouvoir l'exploiter en front-end. Le super utilisateur pourra tout faire. J'ai également changé le fichier d'initialisation de la base de données qui initialiser des objets non conforme aux contraintes d'intégrités tout en ajoutant également le champs super utilisateur.

### Travail effectué semaine du 20/03/2023
#### AHMED Saad El Din
J'ai mis en place la génération de NDF sur le front, j'ai utilisé react-pdf pour créer un pdf qui est téléchargeable. Ensuite j'ai reglé plusieurs bugs niveau application web, notamment la date d'achat qui était envoyée en base sous forme de string et pas de date faussant les filtres par date.  
J'ai ensuite preparé avec le reste de l'équipe les soutenances d'anglais et français à réaliser la semaine d'après.
#### NORTIER Hugo
J'ai écrit une partie du rapport et fait une partie des slides des soutenances.
J'ai ajusté l'affichage de la page d'accueil si l'on est superUtilisateur.
#### BEN EL BEY Yessine
J'ai corrigé plusieurs bugs en front-end concernant la récupération de données des factures et de l'utilisteurs. J'ai également corrigé le fait que quand on modifiait un utilisateur ou une facture alors le formulaire de modification se "vidait" et donc on devait refresh pour refaire une modification en ayant les données en BD.
J'ai mit en place des fichiers de configuration dans le backend pour pouvoir changer l'adresse ip suivant la manière de lancer l'application (déploiement ou dev).

