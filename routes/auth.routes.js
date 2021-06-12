const {Router} = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const {check, validationResult} = require('express-validator');
const Product = require('../models/Product');
const router = Router();
const auth = require('../middleware/auth.middleware');

router.post(
    '/register',
    [
        check('email', 'Некоректна електронна адреса').isEmail(),
        check('name', 'Некоректне ім\'я').isLength({min: 3}),
        check('password', 'Пароль повинен бути хоча б 8 символів').isLength({min: 8})
        
    ],
    async (req, res)=>{
        console.log(req.body);
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректні дані"
            })
        }

        const {email, password, name, secondPass} = req.body;
        if(password!==secondPass) {
            return res.status(400).json({
                message: "Паролі різні"
            })
        }
        const candidate = await User.findOne({email});

        if(candidate) {
           return res.status(400).json({ message: "Користувач вже існує"});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword, name, photo:'/userPhoto.png'});
        await user.save();

        res.status(201).json({ message: "Користувача створено"});

    } catch (e) {
        res.status(500).json({ message: "Помилка сервера"});
    }
})

router.post(
    '/login',
    [
        check('email', 'Некоректна електронна адреса').isEmail(),
        check('password', 'Некоректний пароль').isLength({min: 8})
    ],
    async (req, res)=>{
        try {
            const errors = validationResult(req)
    
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некоректні дані"
                })
            }
    
            const {email, password} = req.body;
            const user = await User.findOne({email});
    
            if(!user) {
               return res.status(400).json({ message: "Користувач не існує"});
            }
            
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Неправильний пароль" })
            }
            const token = jwt.sign(
                { userId: user.id, email:user.email, name:user.name, photo:user.photo },
                config.get('jwtSecret'),
                { expiresIn: '365d' }
            )

            res.json({ token, email, name: user.name, userId: user.id });

        } catch (e) {
            res.status(500).json({ message: "Серверна помилка"});
        }
})

router.get('/user/:id',  async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const newUser = {...user};
        delete newUser._doc.password;
        const fullProducts = [];

        for(let i =0;i<newUser._doc.products.length;i++){
            let product = await Product.findById(newUser._doc.products[i]);
            fullProducts.push(product);
        }
        res.json({...newUser._doc, products: fullProducts});
        res.json(fullProducts);
    } catch (e) {
        res.status(500).json({ message: 'Something wrong. Server error' });
    }
});

router.post('/user/info', auth, async (req, res) => {
    console.log(req.body);
    try {
        const user = await User.findByIdAndUpdate(req.user.userId,{info:{
            ...req.body
            }});
        user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: 'Something wrong. Server error' });
    }
});

router.post('/user/photo', auth, async (req, res) => {
    console.log(req.body);
    try {
        const user = await User.findByIdAndUpdate(req.user.userId,{photo:req.body.url});
        user.save();
        const token = jwt.sign(
            { userId: user.id, email:user.email, name:user.name, photo:req.body.url },
            config.get('jwtSecret'),
            { expiresIn: '365d' }
        )
        res.json({token});
    } catch (e) {
        res.status(500).json({ message: 'Something wrong. Server error' });
    }
});

module.exports = router;