const {Router} = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Region = require('../models/Region');
const auth = require('../middleware/auth.middleware')
const config = require('config');
const File = require('../models/File');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();
//додати товар
router.post('/add',
[
    check('title', 'Incorrect title').exists(),
    check('description', 'Incorrect description').exists(),
    check('category_id', 'Incorrect category').exists(),
    check('region_id', 'Incorrect region').exists(),
    check('photo_ids', 'Incorrect photo').exists(),
    check('price', 'Incorrect price').exists()
],
auth, async (req, res) => {
    
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Incorrect product data"
            })
        }

        const {title, description, price, photo_ids, category_id, region_id} = req.body;

        const timestamp = +new Date();
        const photos = [];
        for(id_ of photo_ids){
            const file = await File.findById(id_);
            photos.push(file.url);
        }
        const product = new Product({
            title,
            description,
            category_id,
            region_id,
            photo_ids:photos,
            price,
            views_count:0,
            timestamp,
            owner: req.user.userId,
            reviews: [],
            status:'active'
        });
        await User.findOneAndUpdate({
            _id:req.user.userId,
        },
        {
            $push:{
                products: product.id
            }
        })
        await product.save();
        res.status(201).json({ message: 'Product added', productId: product.id });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Something wrong. Server error' });
    }
});
//вивести всі
router.get('/',  async (req, res) => {
    try {
        const {date, category_id, region_id, search} = req.query;
        const query = {};
        if(category_id) query.category_id = category_id;
        if(region_id) query.region_id = region_id;
        if(search) query.title = {$regex: search};
        console.log('date', date)
        console.log(query);
        let products = await Product.find(query);
        if(date==='new') products = await Product.find(query).sort({timestamp: -1});
        const changedProducts = [];
        for(item of products){
            const category = await Category.find({ id: item.category_id});
            const region = await Region.find({ id: item.region_id});
            changedProducts.push({...item._doc, category: category[0].name, region: region[0].name})
        }
        res.json(changedProducts);
    } catch (e) {
        res.status(500).json({ message: 'Something wrong. Server error' });
    }
});

router.get('/popular',  async (req, res) => {
    try {
        const {date, category_id, region_id, search} = req.query;
        const query = {};
        if(category_id) query.category_id = category_id;
        if(region_id) query.region_id = region_id;
        if(search) query.title = {$regex: search};
        console.log('date', date)
        console.log(query);
        let products = await Product.find(query).sort({"views_count":-1});
        const changedProducts = [];
        for(item of products){
            const category = await Category.find({ id: item.category_id});
            const region = await Region.find({ id: item.region_id});
            changedProducts.push({...item._doc, category: category[0].name, region: region[0].name})
        }
        res.json(changedProducts);
    } catch (e) {
        res.status(500).json({ message: 'Something wrong. Server error' });
    }
});



router.post('/review/add/:id', auth, async (req, res) => {
    try {
        product = await Product.findById(req.params.id);
        await product.reviews.push({
            ownerId: req.user.userId,
            content: req.body.content,
            photo: req.user.photo,
            name: req.user.name
        })
        await product.save();
        res.json({status: 'success'});
    } catch (e) {
        res.status(500).json({ message: 'Something wrong. Server error' });
    }
});

router.get('/counter/',  async (req, res) => {
    try {
        let products = await Product.find({});
        res.json({count: products.length});
    } catch (e) {
        res.status(500).json(e);
    }
});

router.get('/buy/:id', auth,  async (req, res) => {
    try {
       let product = await Product.findById(req.params.id);
       console.log(product);
       product.status = 'sold';
       product.buyer = req.user.userId;
       await product.save();
        res.json({product});
    } catch (e) {
        res.status(500).json(e);
    }
});

//вивести один по id
router.get('/single/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        await Product.findOneAndUpdate({
                _id:req.params.id,
            },
            {
                $set:{
                    views_count: product._doc.views_count+1
                }
            })

        product = await Product.findById(req.params.id);
        const user = await User.findById(product.owner);
        const category = await Category.find({ id: product.category_id});
        const region = await Region.find({ id: product.region_id});
        const otherProducts = [];
        for(prod of user.products){
            let productInfo =  await Product.findById(prod);
            otherProducts.push(productInfo);
        }



        res.json({...product._doc,category: category[0].name, region: region[0].name, user:{name:user.name, email:user.email, other_products:otherProducts}});
    } catch (e) {
        res.status(500).json({ message: 'Something wrong. Server error' });
    }
});

router.get('/liqpay/', async (req, res) => {
      console.log('GET',req.body);
})

router.post('/liqpay/', async (req, res) => {
    console.log('POST',req.body);
})

module.exports = router;