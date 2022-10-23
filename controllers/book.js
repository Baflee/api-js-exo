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
          .then(() => res.status(201).json({ message: "livre créer !" }))
          .catch(() =>
            res.status(500).json({ error: "Internal servor error 1" })
          );
      }
    })
    .catch(() => res.status(400).send(validInput.errors));
};

exports.getBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {
      res.status(201).send(book);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

exports.getBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(201).send(books);
    })
    .catch((error) => {
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
            res.status(400).send(error);
          }
        );

        if (bookModify) {
          res.status(201).json({ message: "Livre modifié" });
        }
      }
    })
    .catch(() => res.status(400).send(validInput.errors));
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
    .catch(() => res.status(400).send(validInput.errors));
};

exports.getBookWithCategory = async (req, res, next) => {
  Category.findOne({
    name: req.params.name,
  })
    .then((category) => {
      if (!category) {
        res.json({ message: "cette catégorie n'existe pas" });
      } else {
        Book.find({
          categories: { $all: [category._id] },
        })
          .then((book) => {
            res.status(201).send(book);
          })
          .catch((error) => {
            res.status(401).send(error);
          });
      }
    })
    .catch((error) => {
      res.status(401).send(error);
    });
};
