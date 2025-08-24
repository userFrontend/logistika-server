const express = require("express");
const router = express.Router();
const bookCtrl = require("../controller/bookCtrl");

// CRUD
router.post("/books", bookCtrl.add);
router.get("/books", bookCtrl.get);
router.delete("/books/:id", bookCtrl.delete);
router.put("/books/:id", bookCtrl.update);

// Sotib olish
router.post("/books/buy/:id", bookCtrl.buy);

module.exports = router;
