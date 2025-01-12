const mongoose = require("mongoose");
const { Validator } = require("node-input-validator");

const Book = require("../models/book_model");
const Category = require("../models/category_model");

exports.addBook = (req, res, next) => {
  const validInput = new Validator(req.body, {
    title: "required",
    author: "required",
    editor: "required",
    description: "required",
    stock: "required",
    isbn: "required",
    pagenumber: "required",
    price: "required",
    publishingyear: "required",
  });

  validInput
    .check()
    .then((matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const book = new Book({
          images: req.body.images || [],
          author: req.body.author,
          editor: req.body.editor,
          categories: req.body.categories || [],
          description: req.body.description,
          stock: req.body.stock,
          price: req.body.price,
          isbn: req.body.isbn,
          pagenumber: req.body.pagenumber,
          price: req.body.price,
          publishingyear: req.body.publishingyear,
          librarianreview: req.body.librarianreview || "En cours d'examination",
        });

        book
          .save()
          .then(() => res.status(201).json({ message: "Livre créé avec succès !" }))
          .catch((error) => {
            console.error("Erreur lors de l'enregistrement du livre :", error);
            res.status(500).json({ error: "Erreur interne du serveur" });
          });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la validation des données d'entrée :", error);
      res.status(400).send(validInput.errors);
    });
};

exports.getBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {
      res.status(201).send(book);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération du livre :", error);
      res.status(400).send("La récupération du livre a échoué.");
    });
};

exports.getBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(201).send(books);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des livres :", error);
      res.status(400).send("La récupération des livres a échoué.");
    });
};

exports.modifyBook = async (req, res, next) => {
  const validInput = new Validator(req.body, {
    _id: "required",
  });

  const filter = { _id: mongoose.Types.ObjectId(req.body._id) };
  console.log("filter: " + JSON.stringify(filter));
  const update = req.body;
  console.log("update: " + JSON.stringify(update));

  validInput
    .check()
    .then(async (matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const bookModify = await Book.findOneAndUpdate(filter, update).catch(
          (error) => {
            console.error("Erreur lors de la modification du livre :", error);
            res.status(400).send("La modification du livre a échoué.");
          }
        );

        if (bookModify) {
          res.status(201).json({ message: "Livre modifié avec succès !" });
        }
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la validation des données d'entrée :", error);
      res.status(400).send(validInput.errors);
    });
};

exports.deleteBook = (req, res, next) => {
  const validInput = new Validator(req.body, {
    _id: "required",
  });

  validInput
    .check()
    .then(async (matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const bookDelete = await Book.deleteOne({
          _id: mongoose.Types.ObjectId(req.body._id),
        }).catch((error) => {
          console.error("Erreur lors de la suppression du livre :", error);
          res.status(400).send("La suppression du livre a échoué.");
        });

        if (bookDelete.deletedCount == 1) {
          res.status(201).json({ message: "Livre supprimé avec succès !" });
        } else {
          res.status(201).json({
            message: "Cet identifiant n'existe pas dans la base de données des livres",
          });
        }
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la validation des données d'entrée :", error);
      res.status(400).send(validInput.errors);
    });
};

exports.getBookWithCategory = async (req, res, next) => {
  Category.findOne({
    name: req.params.name,
  })
    .then((category) => {
      if (!category) {
        res.json({ message: "Cette catégorie n'existe pas" });
      } else {
        Book.find({
          "categories.0": category.name,
        })
          .then((book) => {
            res.status(201).send(book);
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des livres par catégorie :", error);
            res.status(401).send("La récupération des livres par catégorie a échoué.");
          });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de la catégorie :", error);
      res.status(401).send("La récupération de la catégorie a échoué.");
    });
};