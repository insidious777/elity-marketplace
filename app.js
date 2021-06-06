const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
app.use(express.json({ extended: true }));
app.use(express.static('uploads'));
app.use(express.static(path.join(__dirname, 'client' ,'build')));

app.use(bodyParser.json({limit: "500mb"}));
app.use(bodyParser.urlencoded({limit: "500mb", extended: true, parameterLimit:50000}));


app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/files', require('./routes/files.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/regions', require('./routes/region.routes'));
app.use('/api/products', require('./routes/product.routes'));
const PORT = process.env.PORT || config.get("port");



async function start() {
    try{
        await mongoose.connect(process.env.MONGODB_URI || config.get('mongoUri'),{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        if(process.env.NODE_ENV == 'production'){
            app.use(express.static('client/build'));
        }

        app.listen(PORT, ()=> console.log(`App has been started on ${PORT}`));
    }catch(e){
        console.log('Server Error', e.message);
        process.exit(1);
    }
}

start();



app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});