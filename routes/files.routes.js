const {Router} = require('express');
const File = require('../models/File');
const Product = require('../models/Product');
const auth = require('../middleware/auth.middleware')
const config = require('config');
const fs = require('fs');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();

router.get('/',  async (req, res) => {
    try {
        //const regions = await File.findById();
        //res.sendFile('./uploads/60b26bdcb7b02b05605c123b.png');
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

router.post('/add',
    [
        check('encoded_file', 'Incorrect file').exists(),
        check('file_extension', 'Incorrect file extension').exists(),
        check('filename', 'Incorrect filename').exists()
    ],

    async (req, res) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect regiser data"
                })
            }

            const {encoded_file, file_extension, filename} = req.body;
            let base64File = encoded_file.split(';base64,').pop();
            const file = new File({url:''});
            fs.writeFile(`uploads/${file.id}.${file_extension}`, base64File, {encoding: 'base64'}, function(err) {
                console.log('File created');
            });
            file.url = `/${file.id}.${file_extension}`;
            console.log(file);
            await file.save();
            res.status(201).json(file);

        } catch (e) {
             console.log(e);
             res.status(500).json({ message: 'Something wrong. Server error' });
        }
    });
module.exports = router;