const {Router} = require('express');
const Category = require('../models/Category');
const router = Router();

router.get('/',  async (req, res) => {
    try {
        const regions = await Category.find({});
        res.json(regions);
    } catch (e) {
        res.status(500).json({ message: 'Something wrong. Server error' });
    }
});

module.exports = router;