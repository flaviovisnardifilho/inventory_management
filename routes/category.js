const express = require("express");
const router = express.Router();

// Require controller modules.
const category_controller = require("../controllers/categoryController");

// GET request for creating Category
router.get("/category/create", category_controller.category_create_get);

// POST request for creating Category
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category
router.get('/category/:id/update', category_controller.category_update_get)

// POST request to update Category
router.post('/category/:id/update', category_controller.category_update_post)

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Categories.
router.get("/categories", category_controller.category_list);

module.exports = router;
