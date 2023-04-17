const { default: async } = require("async");
const { body, validationResult } = require("express-validator");

const Item = require("../models/item");
const Category = require("../models/category");
const category = require("../models/category");
const item = require("../models/item");

const currencyOptions = {
  symbol: "$",
  require_symbol: false,
  allow_space_after_symbol: true,
  symbol_after_digits: false,
  allow_negatives: false,
  parens_for_negatives: false,
  negative_sign_before_digits: false,
  negative_sign_after_digits: false,
  allow_negative_sign_placeholder: false,
  thousands_separator: ",",
  decimal_separator: ".",
  allow_decimal: true,
  require_decimal: false,
  digits_after_decimal: [2],
  allow_space_after_digits: false,
};

// Display list of all Items.
exports.item_list = (req, res, next) => {
  // Item.find({}, "name unit stock category")
  Item.find()
    // .sort([["name", "ascending"]])
    // .populate("category")
    .exec(function (err, list_items) {
      if (err) {
        return next(err);
      }
      res.render("item_list", {
        title: "Items list",
        item_list: list_items,
      });
    });
};

// Display detail page for a specific Item.
exports.item_detail = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        return Item.findById(req.params.id).populate("category").exec(callback);
      },
    },
    (err, results) => {
      if (err) next(err);

      if (results.item == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }

      res.render("item_detail", {
        title: "Item Detail",
        item: results.item,
      });
    }
  );
};

// Display Item create form on GET.
exports.item_create_get = (req, res, next) => {
  async.parallel(
    {
      // items(callback) {
      //   Item.find(callback);
      // },
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) next(err);

      res.render("item_form", {
        title: "Create New Item",
        // item: results.items,
        categories: [...new Set(results.categories)],
      });
    }
  );
};

// Display Item create form on POST.
exports.item_create_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description").trim().escape(),
  body("price", "Price must not be empty")
    .trim()
    // .isCurrency(currencyOptions)
    .escape(),
  body("stock", "Stock must be positive or zero")
    .trim()
    // .isNumeric({ min: 0 })
    .escape(),
  body("unit", "Name must not be empty")
    .isIn(["Kg", "Un", "Box", "L"])
    .escape(),
  body("cost", "Cost must be positive")
    .trim()
    // .isCurrency(currencyOptions)
    .escape(),
  body("category.*").escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      unit: req.body.unit,
      cost: req.body.cost,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      // Get all categories for form.
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) next(err);
          // Render again with sanitized values/errors messages.
          res.render("item_form", {
            title: "Create New Item",
            item: item,
            categories: [...new Set(results.categories)],
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Check if Item with same name already exists.
    Item.findOne({
      name: req.body.name,
    }).exec((err, found_item) => {
      if (err) next(err);

      if (found_item) {
        res.redirect(found_item.url);
      } else {
        item.save((err) => {
          if (err) next(err);

          res.redirect(item.url);
        });
      }
    });
  },
];

// Display Item delete form on GET.
exports.item_delete_get = (req, res, next) => {
  Item.findById(req.params.id)
    .populate("category")
    .exec((err, item) => {
      if (err) next(err);

      if (item == null) res.redirect("/items");

      res.render("item_delete", {
        title: "Delete this Item",
        item,
      });
    });
};

// Display Item delete form on POST.
exports.item_delete_post = (req, res, next) => {
  Item.findByIdAndRemove(req.body.itemid, (err) => {
    if (err) next(err);

    res.redirect("/items");
  });
};

// Display Item update form on GET.
exports.item_update_get = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).populate("category").exec(callback);
      },
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) next(err);

      // Render again with sanitized values/errors messages.
      res.render("item_form", {
        title: "Update Item",
        item: results.item,
        categories: [...new Set(results.categories)],
      });
    }
  );
};

// Display Item update form on POST.
exports.item_update_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description").trim().escape(),
  body("price", "Price must not be empty")
    .trim()
    .escape(),
  body("stock", "Stock must be positive or zero")
    .trim()
    .escape(),
  body("unit", "Name must not be empty")
    .isIn(["Kg", "Un", "Box", "L"])
    .escape(),
  body("cost", "Cost must be positive")
    .trim()
    .escape(),
  body("category.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation erros from a request.
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      unit: req.body.unit,
      cost: req.body.cost,
      category: req.body.category,
      _id: req.params.id,
    });


    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
        },

        (err, results) => {
          if (err) next(err);

          res.render("item_form", {
            title: "Update Item",
            item: item,
            categories: [...new Set(results.categories)],
            errors: errors.array(),
          });
          return;
        }
      );
    }

    // Data from form is valid. Update the record.
    Item.findByIdAndUpdate(req.params.id, item, {}, (err, theItem) => {
      if (err) next(err);

      // Successful: redirect to Item detail page.
      res.redirect(theItem.url);
    });
  },
];
