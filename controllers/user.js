const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const pwRules = require('../security/password');
const { Validator } = require('node-input-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
require('dotenv').config();

exports.createUser = (req, res, next) => {
  const validInput = new Validator(req.body, {
    email: 'required|email|length:100',
    password: 'required',
  });

  validInput
    .check()
    .then((matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        if (pwRules.validate(req.body.password)) {
          bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
              const user = new User({
                email: req.body.email,
                password: hash,
                token: '',
                isAdmin: false,
              });

              user
                .save()
                .then(() => res.status(201).json({ message: 'Compte créé !' }))
                .catch((error) => {
                  console.error('Erreur lors de la sauvegarde de l\'utilisateur :', error);
                  res.status(500).json({ error: 'Erreur interne du serveur (Stockage des données utilisateur)' });
                });
            })
            .catch((error) => {
              console.error('Erreur lors du hashage du mot de passe :', error);
              res.status(500).json({ error: 'Erreur interne du serveur (Création du mot de passe)' });
            });
        } else {
          res.json({ message: 'Mot de passe invalide' });
        }
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la validation des données d\'entrée :', error);
      res.status(400).send(validInput.errors);
    });
};

exports.modifyUser = (req, res, next) => {
  const validInput = new Validator(req.body, {
    _id: 'required',
  });

  validInput
    .check()
    .then(async (matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const filter = { _id: mongoose.Types.ObjectId(req.body._id) };

        if (req.body.password) {
          if (pwRules.validate(req.body.password)) {
            await bcrypt
              .hash(req.body.password, 10)
              .then(async (hash) => {
                const updateUser = {
                  email: req.body.email,
                  password: hash,
                  isAdmin: req.body.isAdmin,
                };

                const userFound = await User.findOne({
                  email: req.body.email,
                }).catch((error) => {
                  console.error('Erreur lors de la recherche de l\'utilisateur :', error);
                  res.status(500).json({ error: 'Erreur interne du serveur' });
                });

                if (userFound != null && req.body.email != null) {
                  res.json({ message: 'Email déjà pris' });
                } else {
                  const userModify = User.findOneAndUpdate(filter, updateUser).catch(
                    (error) => {
                      console.error('Erreur lors de la modification de l\'utilisateur :', error);
                      res.status(400).send('La modification de l\'utilisateur a échoué.');
                    }
                  );

                  if (userModify) {
                    res.status(201).json({ message: 'Utilisateur modifié' });
                  }
                }
              })
              .catch((error) => {
                console.error('Erreur lors du hashage du mot de passe :', error);
                res.status(500).json({ error: 'Erreur interne du serveur (Création du mot de passe)' });
              });
          } else {
            res.json({ message: 'Mot de passe invalide' });
          }
        } else if (req.body.password == '') {
          res.json({ message: 'Mot de passe invalide' });
        } else {
          const updateUser = {
            email: req.body.email,
            isAdmin: req.body.isAdmin,
          };

          const userFound = await User.findOne({
            email: req.body.email,
          }).catch((error) => {
            console.error('Erreur lors de la recherche de l\'utilisateur :', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
          });

          if (userFound != null && req.body.email != null) {
            res.json({ message: 'Email déjà pris' });
          } else {
            const userModify = User.findOneAndUpdate(filter, updateUser).catch(
              (error) => {
                console.error('Erreur lors de la modification de l\'utilisateur :', error);
                res.status(400).send('La modification de l\'utilisateur a échoué.');
              }
            );

            if (userModify) {
              res.status(201).json({ message: 'Utilisateur modifié' });
            }
          }
        }
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la validation des données d\'entrée :', error);
      res.status(400).send(validInput.errors);
    });
};

exports.logUser = (req, res, next) => {
  const validInput = new Validator(req.body, {
    email: 'required|email|length:100',
    password: 'required',
  });

  validInput
    .check()
    .then(async (matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const userFound = await User.findOne({
          email: req.body.email,
        }).catch((error) => {
          console.error('Erreur lors de la recherche de l\'utilisateur :', error);
          res.status(500).json({ error: 'Erreur interne du serveur' });
        });

        if (userFound != null) {
          const passwordMatch = await bcrypt
            .compare(req.body.password, userFound.password)
            .catch((error) => {
              console.error('Erreur lors de la comparaison des mots de passe :', error);
              res.status(400).send('La vérification du mot de passe a échoué.');
            });

          if (passwordMatch) {
            const token = jwt.sign(
              {
                _id: userFound._id,
                isAdmin: userFound.isAdmin,
              },
              process.env.SECRETKEYJWT,
              { expiresIn: '24h' }
            );
            const update = {
              token: token,
            };

            const query = { _id: userFound._id };

            const userModify = await User.findOneAndUpdate(query, update).catch(
              (error) => {
                console.error('Erreur lors de la modification de l\'utilisateur :', error);
                res.status(400).send('La mise à jour du token a échoué.');
              }
            );

            if (userModify) {
              res.status(201).send({
                message: 'Compte connecté !',
                user: {
                  _id: userFound._id,
                  email: userFound.email,
                  token: token,
                  isAdmin: userFound.isAdmin,
                },
              });
            }
          } else {
            res.json({ message: 'Mauvais mot de passe' });
          }
        } else {
          res.json({ message: "Ce compte n'existe pas" });
        }
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la validation des données d\'entrée :', error);
      res.status(400).send(validInput.errors);
    });
};

exports.getUser = (req, res, next) => {
  User.findOne({
    _id: req.params.id,
  })
    .then((user) => {
      if (!user) {
        res.json({ message: 'Aucun compte utilise cet identifiant' });
      } else {
        user.token = undefined;
        user.password = undefined;
        user.isAdmin = undefined;
        res.status(201).send(user);
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      res.status(400).send('La récupération de l\'utilisateur a échoué.');
    });
};

exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      users.forEach((user) => {
        user.token = undefined;
        user.password = undefined;
        user.isAdmin = undefined;
      });
      res.status(201).send(users);
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      res.status(400).send('La récupération des utilisateurs a échoué.');
    });
};

exports.deleteUser = (req, res, next) => {
  const validInput = new Validator(req.body, {
    _id: 'required',
  });

  validInput
    .check()
    .then(async (matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const userDelete = await User.deleteOne({
          _id: mongoose.Types.ObjectId(req.body._id),
        }).catch((error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
          res.status(400).send('La suppression de l\'utilisateur a échoué.');
        });

        if (userDelete.deletedCount == 1) {
          res.status(201).json({ message: 'Compte supprimé avec succès' });
        } else {
          res.status(201).json({ message: 'Aucun compte avec cet email n\'existe' });
        }
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la validation des données d\'entrée :', error);
      res.status(400).send(validInput.errors);
    });
};
