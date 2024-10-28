const mongoose = require("mongoose");
const { Validator } = require("node-input-validator");

const Category = require("../models/category_model");

exports.createCategory = (req, res, next) => {
  const validInput = new Validator(req.body, {
    name: "required",
  });

  validInput
    .check()
    .then((matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const category = new Category({
          name: req.body.name,
        });

        category
          .save()
          .then(() =>
            res.status(201).json({ message: "Catégorie de livre créée avec succès !" })
          )
          .catch((error) => {
            console.error("Erreur lors de l'enregistrement de la catégorie :", error);
            res.status(500).json({ error: "Erreur interne du serveur" });
          });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la validation des données d'entrée :", error);
      res.status(400).send(validInput.errors);
    });
};

exports.getCategories = (req, res, next) => {
  Category.find()
    .then((categories) => {
      res.status(201).send(categories);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des catégories :", error);
      res.status(400).send("La récupération des catégories a échoué.");
    });
};

exports.deleteCategory = (req, res, next) => {
  const validInput = new Validator(req.body, {
    name: "required",
  });

  validInput
    .check()
    .then(async (matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const categoryDelete = await Category.deleteOne({
          name: req.body.name,
        }).catch((error) => {
          console.error("Erreur lors de la suppression de la catégorie :", error);
          res.status(400).send("La suppression de la catégorie a échoué.");
        });

        if (categoryDelete.deletedCount == 1) {
          res.status(201).json({ message: "Catégorie supprimée avec succès !" });
        } else {
          res
            .status(201)
            .json({ message: "Aucune catégorie sous ce nom n'existe" });
        }
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la validation des données d'entrée :", error);
      res.status(400).send(validInput.errors);
    });
};