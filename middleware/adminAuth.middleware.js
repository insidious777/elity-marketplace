const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = (req, res, next)=> {
    console.log(req.headers.authorization);
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authorization failed' });
        }

        const decoded = jwt.verify(token, config.get('jwtSecret'));
        console.log(decoded);
        if(!decoded.admin) return res.status(401).json({ message: 'Authorization failed' });
        req.user = decoded;
        next();


    } catch (e) {
        console.log(e);
        return res.status(401).json({ message: 'Authorization failed' });
    }
}