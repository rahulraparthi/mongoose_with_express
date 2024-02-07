
const Product = require('./models/product');
const product = require('./models/product')
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
.then(()=>{
    console.log("Mongoose connection open!");
})
.catch(err => {
    console.log("Mongoose Connection error");
    console.log(err);
})

// const p = new Product({
//     name: 'Buffalo Milk',
//     price: 1.99,
//     category: 'dairy'
// })
// p.save().then(res =>{
//     console.log(res);
// })
// .catch(e =>{
//     console.log(e);
// })

const newProduct = [
{
    name: 'Spinach',
    price: 1.45,
    category: 'vegetable'
},
{
    name: 'Papaya',
    price: 0.99,
    category: 'fruit'
},
{
    name: 'Mango',
    price: 0.55,
    category: 'dairy'
},
{
    name: 'Cow Milk',
    price: 1.99,
    category: 'dairy'
}
]

Product.insertMany(newProduct).then(res =>{
    console.log(res);
})
.catch(e =>{
    console.log(e);
})