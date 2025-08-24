const Book = require("../model/bookModel"); // AboutBook modelni ulash
const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const removeTemp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

const bookCtrl = {
  // 📘 Yangi kitob qo‘shish
  add: async (req, res) => {
    try {
      let bookData = req.body;

      // Agar rasm yuklangan bo‘lsa → cloudinary ga joylaymiz
      if (req.files && req.files.image) {
        const file = req.files.image;
        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
          folder: "BOOKS",
        });
        removeTemp(file.tempFilePath);

        bookData.image = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }

      const newBook = new Book(bookData);
      await newBook.save();

      res.status(201).json({ message: "New book added", data: newBook });
    } catch (error) {
      res.status(503).json({ message: error.message });
    }
  },

  // 📘 Barcha kitoblarni olish
  get: async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json({ message: "All books", data: books });
    } catch (error) {
      res.status(503).json({ message: error.message });
    }
  },

  // 📘 Kitobni o‘chirish
  delete: async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(403).json({ message: "Insufficient information" });

    try {
      const deletedBook = await Book.findByIdAndDelete(id);
      if (!deletedBook) return res.status(400).send({ message: "Book not found" });

      if (deletedBook.image) {
        await cloudinary.v2.uploader.destroy(deletedBook.image.public_id);
      }

      res.status(200).send({ message: "Book deleted", data: deletedBook });
    } catch (error) {
      res.status(503).json({ message: error.message });
    }
  },

  // 📘 Kitobni yangilash
  update: async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(403).json({ message: "Insufficient information" });

    try {
      const book = await Book.findById(id);
      if (!book) return res.status(400).send({ message: "Book not found" });

      if (req.files && req.files.image) {
        const file = req.files.image;
        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
          folder: "BOOKS",
        });
        removeTemp(file.tempFilePath);

        if (book.image) {
          await cloudinary.v2.uploader.destroy(book.image.public_id);
        }

        req.body.image = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }

      const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).send({ message: "Book updated", data: updatedBook });
    } catch (error) {
      res.status(503).json({ message: error.message });
    }
  },

  // 📘 Kitob sotib olish → stock kamayadi
  buy: async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(403).json({ message: "Insufficient information" });

    try {
      const book = await Book.findById(id);
      if (!book) return res.status(404).json({ message: "Book not found" });

      if (book.stock <= 0) return res.status(400).json({ message: "Out of stock" });

      book.stock -= 1;
      await book.save();

      res.status(200).json({ message: "Book purchased", data: book });
    } catch (error) {
      res.status(503).json({ message: error.message });
    }
  },
};

module.exports = bookCtrl;
