const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

const Product = require('./models/productModel');

const data = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));

const products = data.map((p) => {
  const { _id, name, price, long_desc, short_desc, category, ...imgs } = p;
  return { name, price, long_desc, short_desc, category, images: Object.values(imgs) };
});

(async () => await Product.create(products))();
// console.log(products);
