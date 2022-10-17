const mongoose = require("mongoose");
const { Validator } = require("node-input-validator");

const Category = require("../models/category_model");

exports.createCategory = (req, res, next) => {
  // Prepare the input data validation
  const validInput = new Validator(req.body, {
    name: "required",
  });

  // Check the input data from the frontend
  validInput
    .check()
    .then((matched) => {
      // If input is not safe, handle the error
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        // Format the user data for storage
        const category = new Category({
          name: req.body.name,
        });

        // Store the user data in the database
        console.log(category.name);
        category
          .save()
          .then(() =>
            res.status(201).json({ message: "Book Category created !" })
          )
          .catch(() =>
            res.status(500).json({ error: "Internal server error" })
          );
      }
    })
    .catch(() => res.status(400).send(validInput.errors));
};

exports.getCategories = (req, res, next) => {
  Category.find()
    .then((categories) => {
      res.status(201).send(categories);
    })
    .catch((error) => {
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
      // If input is not safe, handle the error
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const categoryDelete = await Category.deleteOne({
          name: req.body.name,
        }).catch((error) => {
          res.status(400).send(error);
        });

        if (categoryDelete.deletedCount == 1) {
          res.status(201).json({ message: "Categorié Supprimée" });
        } else {
          res
            .status(201)
            .json({ message: "Aucune catégorie sous ce nom existe" });
        }
      }
    })
    .catch(() => res.status(400).send(validInput.errors));
};
