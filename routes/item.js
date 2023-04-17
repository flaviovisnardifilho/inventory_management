const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");

// GET request for creating Item
router.get("/item/create", item_controller.item_create_get);

// POST request for creating Item
router.post("/item/create", item_controller.item_create_post);

// GET request to delete Item
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete Item
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update Item
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update Item
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one Item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all Items.
router.get("/items", item_controller.item_list);

module.exports = router;
