const express = require('express')
const app = express();
const  methodOverride = require('method-override')
const path = require('path');   
const mongoose = require('mongoose');
const Farm = require('./models/farm');
const AppError = require('./AppError')

const Product = require('./models/product')
mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
.then(()=>{
    console.log("Mongoose connection open!");
})
.catch(err => {
    console.log("Mongoose Connection error");
    console.log(err);
})

app.set('views', path.join(__dirname , 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true})) 
app.use(methodOverride('_method'))

const categories = ['fruit','vegetable', 'dairy']

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}
// GET ROUTES OF FARMS
app.get('/farms', async(req,res)=>{
    const farms = await Farm.find({})
    res.render('farms/index', {farms})
})
app.get('/farms/new', (req,res)=>{
    res.render('farms/new')
    
})
app.get('/farms/:id', async(req,res) =>{
    const farm = await Farm.findById(req.params.id).populate('products');
    console.log(farm)
    res.render('farms/show',{farm})
})
app.post('/farms', async(req,res)=>{
    const farm = new Farm(req.body)
    await farm.save()
    res.redirect('/farms')
})
app.get('/farms/:id/products/new', async(req,res)=>{
    const {id} = req.params;
    const farm = await Farm.findById(id)
    res.render('products/new',{categories, farm});
})
app.post('/farms/:id/products', async(req,res)=>{
    const {id} = req.params
    const farm = await Farm.findById(id)
    const {name, price , category} = req.body;
    const product = new Product({name , price, category});
    farm.products.push(product);
    product.farm = farm;
    await farm.save()
    await product.save()
    res.redirect(`/farms/${id}`)
})






// Get  ROUTES OF PRODUCTS
app.get('/dog', (req,res) =>{
    res.send("BARKK!!")
})
app.get('/products', async (req,res) =>{
    const  {category} = req.query
    if(category){
        const products = await Product.find({category});
        res.render('products/index' , { products , category })
     } else{
         const products = await Product.find({});
         res.render('products/index' , { products , category: 'All' })
     }
 
})

app.get('/products/new', (req,res) => {
    // throw new AppError('Not Allowed', 401)
    res.render('products/new', { categories })
})
app.post('/products', wrapAsync(async (req,res,next) => {
   
        const newProduct = new Product(req.body);
        await newProduct.save()
        res.redirect(`/products/${newProduct._id}`)
    
   
}))
app.get('/products/:id', async(req,res,next)=>{
    const { id } = req.params
    const product = await Product.findById(id)
    if(!product){
       return next(new AppError('Product Not Found', 404));
    }
    res.render('products/show', {product})

})
app.put('/products/:id', wrapAsync( async (req, res, next) => {
       const { id } = req.params;
       const product = await Product.findByIdAndUpdate(id, req.body, {runValidator: true , new:true});
       res.redirect(`/products/${product._id}`);

}))
app.get('/products/:id/edit', wrapAsync(async (req,res,next) => {
    
    const { id } = req.params
    const product = await Product.findById(id)
    if(!product){
        return next(new AppError('Product Not Found', 404));
     }
    res.render('products/edit', { product, categories})
   
}))
app.delete('/product/:id/', async (req, res)=>{
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)
    res.redirect('/products')
})
app.use((err, req, res, next) => {
    const {message = 'There was something wrong' , status = 500 } = err;
    res.send(message).status(status)
})
app.listen(3000, () =>{
    console.log("listening from port 3000")
})  