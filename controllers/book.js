const mongoose = require("mongoose");
const { Validator } = require("node-input-validator");

// import book model
const Book = require("../models/book_model");

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
      // If input is not safe, handle the error
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        // Format the book data for storage
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

        console.log(book);
        // Store the user data in the database
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
  const validInput = new Validator(req.body, {
    _id: "required",
  });

  validInput
    .check()
    .then(async (matched) => {
      // If input is not safe, handle the error
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        const bookExist = await Book.findOne({
          _id: mongoose.Types.ObjectId(req.body._id),
        }).catch((error) => {
          res.status(400).send(error);
        });

        if (bookExist != null) {
          res.status(201).send(bookExist);
        } else {
          res.json({
            message: "Ce livre n'est pas présent dans la base de donnée",
          });
        }
      }
    })
    .catch(() => res.status(400).send(validInput.errors));
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
  // Prepare the input data validation
  // Check the input data from the frontend
  // If input is not safe, handle the error
  // Else
  // Use the request parameters to find the book data
  // Update the book data
  /* You could use first the mongoose method .findOne(),
   * and after you could use the mongoose methode .updateOne.
   *
   * Or you could use the combined method .findOneAndUpdate()
   *
   * */
  // Catch mongoose error
  // Catch input validator error
  const validInput = new Validator(req.body, {
    _id: "required",
  });

  const filter = { _id: mongoose.Types.ObjectId(req.body._id) };

  const update = req.body;

  validInput.check().then(async (matched) => {
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
  }).catch(() => res.status(400).send(validInput.errors));
};

exports.deleteBook = (req, res, next) => {
  const validInput = new Validator(req.body, {
    _id: "required",
  });

  validInput
    .check()
    .then(async (matched) => {
      // If input is not safe, handle the error
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