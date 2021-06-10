const {Router} = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const {check, validationResult} = require('express-validator');
const adminAuth = require('../middleware/adminAuth.middleware')
const router = Router();

router.post('/login', async (req, res)=>{
    try {
            const {email, password} = req.body;
            const user = await User.findOne({email});

            if(!user) {
                return res.status(400).json({ message: "Користувач не існує"});
            }

            const isMatch = await bcrypt.compare(password, user.password);


            if (!isMatch) {
                return res.status(400).json({ message: "Неправильний пароль" })
            }
            if (!user.is_admin) {
                return res.status(400).json({ message: "Користувач не адміністратор" })
            }
            const token = jwt.sign(
                { userId: user.id, email:user.email, name:user.name, admin:true },
                config.get('jwtSecret'),
                { expiresIn: '365d' }
            )

            res.json({token});

        } catch (e) {
            res.status(500).json({ message: "Серверна помилка"});
        }
    })

router.get('/users', adminAuth,async (req, res)=>{
    const users = await User.find({});
    res.json({users});
})

module.exports = router;