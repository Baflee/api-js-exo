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
            res.status(201).json({ message: "Catégorie de livre créée !" })
          )
          .catch((error) => {
            console.error("Error saving category:", error); // Add this
            res.status(500).json({ error: "Internal server error" });
          });
      }
    })
    .catch((error) => {
      console.error("Error validating input:", error); // Add this
      res.status(400).send(validInput.errors);
    });
};

exports.getCategories = (req, res, next) => {
  Category.find()
    .then((categories) => {
      res.status(201).send(categories);
    })
    .catch((error) => {
      console.error("Error fetching categories:", error); // Add this
      res.status(400).send(error);
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
          console.error("Error deleting category:", error); // Add this
          res.status(400).send(error);
        });

        if (categoryDelete.deletedCount == 1) {
          res.status(201).json({ message: "Catégorie Supprimée" });
        } else {
          res
            .status(201)
            .json({ message: "Aucune catégorie sous ce nom existe" });
        }
      }
    })
    .catch((error) => {
      console.error("Error validating input:", error); // Add this
      res.status(400).send(validInput.errors);
    });
};
