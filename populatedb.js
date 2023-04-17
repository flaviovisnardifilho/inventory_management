#! /usr.bin/env node

console.log(
  'This script populates some test items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/inventory_management?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(name, description) {
  const category = new Category({ name, description });
  await category.save();
  categories.push(category);
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  name,
  description,
  price,
  stock,
  unit,
  cost,
  category
) {
  const item = new Item({
    name,
    description,
    price,
    stock,
    unit,
    cost,
    category,
  });

  await item.save();
  items.push(item);
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate("Fish", "Tilapia, Golden, Round..."),
    categoryCreate("Bait", "Worms, locust, slug..."),
    categoryCreate("Equipment", "Fishing poles, chairs, hooks"),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      "Tilapia",
      "Sarotherodos niloticus",
      22.0,
      1200.0,
      "Kg",
      14.0,
      categories[0]
    ),
    itemCreate(
      "Dourado",
      "Salminus brasiliensis",
      72.0,
      300.0,
      "Kg",
      49.0,
      categories[0]
    ),
    itemCreate(
      "Tucunare",
      "Cichla piquit",
      48.0,
      180.0,
      "Kg",
      29.0,
      categories[0]
    ),
    itemCreate(
      "Earthworm",
      "Rhinodrilus alatus",
      15.0,
      0.2,
      "Kg",
      8.0,
      categories[1]
    ),
    itemCreate("Slug", "Stylommatophora", 10.0, 1, "Un", 4.0, categories[1]),
    itemCreate(
      "Windlass 2000",
      "The best one",
      128.0,
      1,
      "Un",
      22.0,
      categories[2]
    ),
    itemCreate(
      "Barbless Hook One",
      "Catch them all",
      25.0,
      1,
      "Box",
      3.0,
      categories[2]
    ),
  ]);
}
