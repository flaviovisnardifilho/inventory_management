const { body, validationResult } = require("express-validator");
const Category = require("../models/category");

// Display list of all categories
exports.category_list = (req, res, next) => {
  Category.find().exec(function (err, list_category) {
    if (err) next(err);

    res.render("category_list", {
      title: "Category List",
      category_list: list_category,
    });
  });
};

// Display detail page for a specific Category
exports.category_detail = (req, res, next) => {
  Category.findById(req.params.id).exec(function (err, thecategory) {
    if (err) next(err);

    if (thecategory == null) {
      // No results.
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    res.render("category_detail", {
      title: "Category Detail",
      category: thecategory,
    });
  });
};

// Display Category create form on GET.
exports.category_create_get = (req, res, next) => {
  res.render("category_form", {
    title: "Create a Category",
  });
};

// Display Category create form on POST.
exports.category_create_post = [
  // Validate and sanitize fields.
  body("category_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .withMessage("Name of Category must be be specified."),
  body("category_description")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape()
    .withMessage("Description must be specified."),
  // Process request after validation and sanitization.
  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.category_name,
      description: req.body.category_description,
    });

    if (!errors.isEmpty()) {
      // Render again with sanitized values/errors messages.
      res.render("category_form", {
        title: "Create New Category",
        category: category,
        errors: errors.array(),
      });
      return;
    }

    // Check if Category with same name already exists.
    Category.findOne({
      name: req.body.category_name,
    }).exec((err, found_category) => {
      if (err) next(err);

      if (found_category) {
        res.redirect(found_category.ulr);
      } else {
        category.save((err) => {
          if (err) next(err);

          res.redirect(category.url);
        });
      }
    });
  },
];

// Display Category delete form on GET.
exports.category_delete_get = (req, res, next) => {
  Category.findById(req.params.id).exec((err, result) => {
    if (err) next(err);

    if (result == null) res.redirect("/categories");

    // Successfull, so render
    res.render("category_delete", {
      title: "Delete Category",
      category: result,
    });
  });
};

// Display Category delete form on POST.
exports.category_delete_post = (req, res, next) => {
  Category.findByIdAndRemove(req.body.categoryid, (err) => {
    if (err) next(err);

    res.redirect("/categories");
  });
};

// Display Category update form on GET.
exports.category_update_get = (req, res, next) => {
  Category.findById(req.params.id).exec((err, category) => {
    if (err) next(err);

    if (category == null) {
      const err = new Error("Category not found.");
      err.status = 404;
      return next(err);
    }

    // Sucess, so render.
    res.render("category_form", {
      title: "Update Category",
      category: category,
    });
  });
};

// Display Category update form on POST.
exports.category_update_post = [
  // Validate and sanitize fields.
  body("category_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .withMessage("Name must be specified, and be less then 30 characters."),
  body("category_description")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape()
    .withMessage(
      "Description must be specified, and be less then 50 characters"
    ),

  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.category_name,
      description: req.body.category_description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      Category.findByIdAndUpdate(
        req.params.id,
        category,
        {},
        (err, theCategory) => {
          if (err) next(err);

          res.redirect(theCategory.url);
        }
      );
    }
  },
];
