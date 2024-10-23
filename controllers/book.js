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
          title: req.body.title,
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
          .then(() => res.status(201).json({ message: "Livre créé !" }))
          .catch((error) => {
            console.error("Error saving book:", error); // Add this
            res.status(500).json({ error: "Internal server error 1" });
          });
      }
    })
    .catch((error) => {
      console.error("Error validating input:", error); // Add this
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
      console.error("Error fetching book:", error); // Add this
      res.status(400).send(error);
    });
};

exports.getBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(201).send(books);
    })
    .catch((error) => {
      console.error("Error fetching books:", error); // Add this
      res.status(400).send(error);
    });
};

exports.modifyBook = async (req, res, next) => {
  const validInput = new Validator(req.body, {
    _id: "required",
  });

  const filter = { _id: mongoose.Types.ObjectId(req.body._id) };
  const update = req.body;

  validInput
    .check()
    .then(async (matched) => {
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const bookModify = await Book.findOneAndUpdate(filter, update).catch(
          (error) => {
            console.error("Error modifying book:", error); // Add this
            res.status(400).send(error);
          }
        );

        if (bookModify) {
          res.status(201).json({ message: "Livre modifié" });
        }
      }
    })
    .catch((error) => {
      console.error("Error validating input:", error); // Add this
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
          console.error("Error deleting book:", error); // Add this
          res.status(400).send(error);
        });

        if (bookDelete.deletedCount == 1) {
          res.status(201).json({ message: "Livre Supprimé" });
        } else {
          res.status(201).json({
            message: "Cette id n'existe pas dans la base de donnée des livres",
          });
        }
      }
    })
    .catch((error) => {
      console.error("Error validating input:", error); // Add this
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
          categories: { $all: [category.name] },
        })
          .then((book) => {
            res.status(201).send(book);
          })
          .catch((error) => {
            console.error("Error fetching books by category:", error); // Add this
            res.status(401).send(error);
          });
      }
    })
    .catch((error) => {
      console.error("Error fetching category:", error); // Add this
      res.status(401).send(error);
    });
};