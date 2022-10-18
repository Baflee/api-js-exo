const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const pwRules = require("../security/password");
const { Validator } = require("node-input-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

exports.createUser = (req, res, next) => {
  // Prepare the input data validation
  const validInput = new Validator(req.body, {
    email: "required|email|length:100",
    password: "required",
  });

  let update = {
    email: req.body.email,
    isAdmin: req.body.isAdmin,
  };

  // Check the input data from the frontend
  validInput
    .check()
    .then((matched) => {
      // If input is not safe, handle the error
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        // If the input is safe, check the password strengh
        if (pwRules.validate(req.body.password)) {
          // Hash the password
          bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
              // Format the user data for storage
              const user = new User({
                email: req.body.email,
                password: hash,
                token: "",
                isAdmin: false,
              });

              console.log(user);

              // Store the user data in the database
              user
                .save()
                .then(() => res.status(201).json({ message: "Compte créer !" }))
                .catch(() =>
                  res
                    .status(500)
                    .json({ error: "Internal servor error (Store User Data)" })
                );
            })
            .catch(() =>
              res
                .status(500)
                .json({ error: "Internal servor error (Password Maker)" })
            );
        } else {
          throw "Invalid password";
        }
      }
    })
    .catch(() =>
      res.status(400).send({ message: "test", details: validInput.errors })
    );
};

exports.modifyUser = (req, res, next) => {
  // Prepare the input data validation
  const validInput = new Validator(req.body, {
    _id: "required",
  });

  // Check the input data from the frontend
  validInput
    .check()
    .then(async (matched) => {
      // If input is not safe, handle the error
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const filter = { _id: mongoose.Types.ObjectId(req.body._id) };

        if (req.body.email) {
          const userFound = await User.findOne({ email: req.body.email }).catch(
            () => res.status(500).json({ error: "Internal servor error 1" })
          );

          console.log(userFound);

          if (userFound != null) {
            res.json({ message: "Email déja pris" });
          }
        }

        if (req.body.password) {
          if (pwRules.validate(req.body.password)) {
            // Hash the password
            await bcrypt
              .hash(req.body.password, 10)
              .then(async (hash) => {
                const updateUser = {
                  email: req.body.email,
                  password: hash,
                  isAdmin: req.body.isAdmin,
                };

                const userModify = User.findOneAndUpdate(
                  filter,
                  updateUser
                ).catch((error) => {
                  res.status(400).send(error);
                });

                if (userModify) {
                  res.status(201).json({ message: "Utilisateur modifié" });
                }
              })
              .catch(() =>
                res
                  .status(500)
                  .json({ error: "Internal servor error (Password Maker)" })
              );
          } else {
            res.json({ message: "Mot de passe invalide" });
          }
        } else if (req.body.password == "") {
          res.json({ message: "Mot de passe invalide" });
        } else {
          const updateUser = {
            email: req.body.email,
            isAdmin: req.body.isAdmin,
          };

          const userModify = User.findOneAndUpdate(
            filter,
            updateUser
          ).catch((error) => {
            res.status(400).send(error);
          });

          if (userModify) {
            res.status(201).json({ message: "Utilisateur modifié" });
          }
        }
      }
    })
    .catch(() => res.status(400).send(validInput.errors));
};

exports.logUser = (req, res, next) => {
  // Prepare the input data validation
  /* Your code here
   *
   *
   *
   * */
  // Check the input data from the frontend
  // If input is not safe, handle the error
  // Else
  // If the input is safe, use the email to check if a user account exists
  // You will need a mongoose method called .findOne()
  // If user doesn't exist, handle the error in a safe way
  // If user exists, compare the input password and the password stored in database
  // You will need a bcrypt method called .compare()
  // If input password is incorrect, handle the error in a safe way
  // If input password is correct, return userId and privileges
  // Catch bcrypt error
  // Catch mongoose error
  // Catch input validator error

  // Prepare the input data validation
  const validInput = new Validator(req.body, {
    email: "required|email|length:100",
    password: "required",
  });

  validInput
    .check()
    .then(async (matched) => {
      // If input is not safe, handle the error
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const userFound = await User.findOne({ email: req.body.email }).catch(
          () => res.status(500).json({ error: "Internal servor error 1" })
        );

        if (userFound != null) {
          console.log("test 1");
          console.log(userFound);
          const passwordMatch = await bcrypt
            .compare(req.body.password, userFound.password)
            .catch((error) => {
              res.status(400).send(error);
            });

          if (passwordMatch) {
            const update = {
              token: jwt.sign(
                {
                  _id: userFound._id,
                  isAdmin: userFound.isAdmin,
                },
                "RANDOM_TOKEN_SECRET",
                { expiresIn: "24h" }
              ),
            };
            console.log(update.token);

            const query = { _id: userFound._id };

            const userModify = await User.findOneAndUpdate(query, update).catch(
              (error) => {
                res.status(400).send(error);
              }
            );

            console.log(userModify);

            if (userModify) {
              res.status(201).send({ message: "Compte connecté !" });
            }
          } else {
            res.json({ message: "Mauvais Mot de passe" });
          }
        } else {
          res.json({ message: "Ce compte n'existe pas" });
        }
      }
    })
    .catch(() => res.status(400).send(validInput.errors));
};

exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(201).send(users);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

exports.getUser = (req, res, next) => {
  // Check if the logged user is the owner of the requested account
  // Return the user account data
  // Catch mongoose error
  // Else
  // Use the request parameters to find the user account
  // Return the user account data in a way that respect its privacy
  // Catch mongoose error

  const validInput = new Validator(req.body, {
    email: "required|email|length:100",
  });

  validInput
    .check()
    .then(async (matched) => {
      // If input is not safe, handle the error
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const userExist = await User.findOne({ email: req.body.email }).catch(
          (error) => {
            res.status(400).send(error);
          }
        );

        if (userExist != null) {
          res.status(201).send(userExist);
        } else {
          res.json({
            message: "Cet email n'est pas présent dans la base de donnée",
          });
        }
      }
    })
    .catch(() => res.status(400).send(validInput.errors));
};

exports.deleteUser = (req, res, next) => {
  // Use the request parameters to find the user account
  // If the user account doesn't exists, handle the error
  // Check if the user is authorized to delete the account
  // Delete the account
  // You will need a mongoose method called .deleteOne()
  // Catch mongoose error
  // Else
  // Handle the error
  // Catch mongoose error

  const validInput = new Validator(req.body, {
    email: "required|email|length:100",
  });

  validInput
    .check()
    .then(async (matched) => {
      // If input is not safe, handle the error
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const userDelete = await User.deleteOne({
          email: req.body.email,
        }).catch((error) => {
          res.status(400).send(error);
        });

        if (userDelete.deletedCount == 1) {
          res.status(201).json({ message: "Compte Supprimé" });
        } else {
          res
            .status(201)
            .json({ message: "Aucun compte sous cette email existe" });
        }
      }
    })
    .catch(() => res.status(400).send(validInput.errors));
};
