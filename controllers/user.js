const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const pwRules = require('../security/password')
const { Validator } = require('node-input-validator')
const jwt = require('jsonwebtoken')
const User = require('../models/user_model')

exports.createUser = (req, res, next) => {
  const validInput = new Validator(req.body, {
    email: 'required|email|length:100',
    password: 'required',
  })

  validInput
    .check()
    .then((matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors)
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
              })

              user
                .save()
                .then(() => res.status(201).json({ message: 'Compte créer !' }))
                .catch(() =>
                  res
                    .status(500)
                    .json({ error: 'Internal servor error (Store User Data)' }),
                )
            })
            .catch(() =>
              res
                .status(500)
                .json({ error: 'Internal servor error (Password Maker)' }),
            )
        } else {
          throw 'Invalid password'
        }
      }
    })
    .catch(() => res.status(400).send(validInput.errors))
}

exports.modifyUser = (req, res, next) => {
  const validInput = new Validator(req.body, {
    _id: 'required',
  })

  validInput
    .check()
    .then(async (matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors)
      } else {
        const filter = { _id: mongoose.Types.ObjectId(req.body._id) }

        if (req.body.password) {
          if (pwRules.validate(req.body.password)) {
            await bcrypt
              .hash(req.body.password, 10)
              .then(async (hash) => {
                const updateUser = {
                  email: req.body.email,
                  password: hash,
                  isAdmin: req.body.isAdmin,
                }

                const userFound = await User.findOne({
                  email: req.body.email,
                }).catch(() =>
                  res.status(500).json({ error: 'Internal servor error 1' }),
                )

                if (userFound != null && req.body.email != null) {
                  res.json({ message: 'Email déja pris' })
                } else {
                  const userModify = User.findOneAndUpdate(
                    filter,
                    updateUser,
                  ).catch((error) => {
                    res.status(400).send(error)
                  })

                  if (userModify) {
                    res.status(201).json({ message: 'Utilisateur modifié' })
                  }
                }
              })
              .catch(() =>
                res
                  .status(500)
                  .json({ error: 'Internal servor error (Password Maker)' }),
              )
          } else {
            res.json({ message: 'Mot de passe invalide' })
          }
        } else if (req.body.password == '') {
          res.json({ message: 'Mot de passe invalide' })
        } else {
          const updateUser = {
            email: req.body.email,
            isAdmin: req.body.isAdmin,
          }

          const userFound = await User.findOne({
            email: req.body.email,
          }).catch(() =>
            res.status(500).json({ error: 'Internal servor error 1' }),
          )

          if (userFound != null && req.body.email != null) {
            res.json({ message: 'Email déja pris' })
          } else {
            const userModify = User.findOneAndUpdate(filter, updateUser).catch(
              (error) => {
                res.status(400).send(error)
              },
            )

            if (userModify) {
              res.status(201).json({ message: 'Utilisateur modifié' })
            }
          }
        }
      }
    })
    .catch(() => res.status(400).send(validInput.errors))
}

exports.logUser = (req, res, next) => {
  const validInput = new Validator(req.body, {
    email: 'required|email|length:100',
    password: 'required',
  })

  validInput
    .check()
    .then(async (matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors)
      } else {
        const userFound = await User.findOne({
          email: req.body.email,
        }).catch(() =>
          res.status(500).json({ error: 'Internal servor error 1' }),
        )

        if (userFound != null) {
          const passwordMatch = await bcrypt
            .compare(req.body.password, userFound.password)
            .catch((error) => {
              res.status(400).send(error)
            })

          if (passwordMatch) {
            const token = jwt.sign(
              {
                _id: userFound._id,
                isAdmin: userFound.isAdmin,
              },
              process.env.SECRETKEYJWT,
              { expiresIn: '24h' },
            )
            const update = {
              token: token,
            }

            const query = { _id: userFound._id }

            const userModify = await User.findOneAndUpdate(query, update).catch(
              (error) => {
                res.status(400).send(error)
              },
            )

            if (userModify) {
              res.status(201).send({
                message: 'Compte connecté !',
                user: {
                  _id: userFound._id,
                  email: userFound.email,
                  token: token,
                  isAdmin: userFound.isAdmin,
                },
              })
            }
          } else {
            res.json({ message: 'Mauvais Mot de passe' })
          }
        } else {
          res.json({ message: "Ce compte n'existe pas" })
        }
      }
    })
    .catch(() => res.status(400).send(validInput.errors))
}

exports.getUser = (req, res, next) => {
  User.findOne({
    _id: req.params.id,
  })
    .then((user) => {
      if (!user) {
        res.json({ message: 'Aucun compte utilise cette id' })
      } else {
        user.token = undefined
        user.password = undefined
        user.isAdmin = undefined
        res.status(201).send(user)
      }
    })
    .catch((error) => {
      res.status(400).send(error)
    })
}

exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      users.forEach((user) => {
        user.token = undefined
        user.password = undefined
        user.isAdmin = undefined
      })
      res.status(201).send(users)
    })
    .catch((error) => {
      res.status(400).send(error)
    })
}

exports.deleteUser = (req, res, next) => {
  const validInput = new Validator(req.body, {
    _id: 'required',
  })

  validInput
    .check()
    .then(async (matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors)
      } else {
        const userDelete = await User.deleteOne({
          _id: mongoose.Types.ObjectId(req.body._id),
        }).catch((error) => {
          res.status(400).send(error)
        })

        if (userDelete.deletedCount == 1) {
          res.status(201).json({ message: 'Compte Supprimé' })
        } else {
          res
            .status(201)
            .json({ message: 'Aucun compte sous cette email existe' })
        }
      }
    })
    .catch(() => res.status(400).send(validInput.errors))
}
