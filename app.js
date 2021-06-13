const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('admin-bro-mongoose');

require('./models/Category.js');
require('./models/File.js');
require('./models/Product.js');
require('./models/Region.js');
require('./models/User.js');

const app = express();
AdminBro.registerAdapter(AdminBroMongoose);
const adminBro = new AdminBro({
    databases: [mongoose],
    rootPath: '/admin',
})
const ADMIN = {
    email: process.env.ADMIN_EMAIL || '777insidious777@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'admin'
}
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    cookieName: process.env.ADMIN_COOKIE_NAME || 'admin',
    cookiePassword: process.env.ADMIN_COOKIE_PASS || 'admin',
    authenticate: async (email, password) => {
        if(email === ADMIN.email && password === ADMIN.password){
            return ADMIN
        }
        return null
    }
})
app.use(adminBro.options.rootPath, router)

app.use(bodyParser.json({limit: "500mb"}));
app.use(bodyParser.urlencoded({limit: "500mb", extended: true, parameterLimit:50000}));

app.use(express.json({ extended: true }));
app.use(express.static('uploads'));
app.use(express.static(path.join(__dirname, 'client' ,'build')));




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