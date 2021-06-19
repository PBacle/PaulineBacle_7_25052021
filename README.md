#  OpenClassrooms-Développeur Web 📎 Projet 7 - Créez un réseau social d’entreprise (Groupomania)

👤 &nbsp; **Pauline BACLE** [🇫🇷 Contactez moi ](<bacle-pauline@orage.fr>)
_`Début du projet le .../.../2021`_

## Contenu de ce repository

* Ce repository contient les deux dossiers `frontend` et `backend`.
* Ce projet a été créé avec : 
- VueJs + vuex 
- NodeJs + express 
- Mysql


### 🔨 &nbsp; Installation

* Cloner ce projet depuis GitHub.

#### 💡 &nbsp; Frontend

* Ouvrir le dossier frontend sur le terminal  et exécuter  `npm install` pour installer les dépendances.
* Le projet a été généré avec Angular CLI version 7.0.2.
* Démarrer avec la commande `npm run serve` pour avoir accès au serveur de développement.
* Rendez-vous sur `http://localhost:8080`.
* L'application va se recharger automatiquement si vous modifiez un fichier source.

#### 💡 &nbsp; Backend

* Ouvrir le dossier backend sur le terminal.
* Pour utiliser le serveur, chargez le package nodemon : `npm install -g nodemon`.
* Puis lancez le serveur: `nodemon server`.

#### 💡 Base de données

Se connecter au serveur **MySql** de votre choix.
Exécuter la commande: `CREATE DATABASE groupomania;`
Vérifiez les identifiants dans le fichier mysql-connection.js du dossier backend puis importer le fichier groupomania.sql fourni :

    mysql -u root -p groupomania < groupomania.sql

en remplaçant `groupomania.sql` par le chemin du fichier dans votre machine.

Remarque : Au lancement de l'application un compte administrateur est automatiquement créé, s'il n'existe pas dans la base de donnée. 
Les identifiants sont fournis dans le fichier config.js dans le dossier config du répertoire backend.


### 🖥 &nbsp; Connexion et utilisation

* Une fois les deux serveurs allumés, l'application est disponible en ouvrant l'url suivante dans le navigateur : `http://localhost:8080`
* Pour vous inscrire sur le réseau de Groupomania, il vous faudra renseigner : 
- Votre nom et prénom
- Une adresse mail valide
- Un mot de passe (de 8 à 100 caractères, comprenant des majuscules et minuscules et au moins 2 chiffres, pas de symboles ou de lettres accentués).

Vous pouvez aussi fournir Un pseudo, facultatif, (max. 30 caractères, chiffres et lettres acceptés, ainsi que les symboles . et _).

Vous pourrez par la suite modifier votre profil (notamment ajouter : pseudo, bio, photo) en allant sur votre profil. Votre compte peut être supprimé par vous-même ainsi que par l'administrateur.

Une fois connecté vous pouvez voir les publications des utilisateurs et publier au choix:
- un post contenant une image ou non, 
- un commentaire sur un post déjà publié. 
Toutes les publications peuvent être likées par tous les utilisateurs. 

Seuls l'auteur/le propriétaire du compte et l'administrateur peuvent : 
- modifier et supprimer un compte, 
- modifier et supprimer un post, 
- supprimer un commentaire. 
