const {Router} = require('express');
const Region = require('../models/Region');
const router = Router();

router.get('/',  async (req, res) => {
    try {
        const regions = await Region.find({});
        res.json(regions);
    } catch (e) {
        res.status(500).json({ message: 'Something wrong. Server error' });
    }
});

module.exports = router;