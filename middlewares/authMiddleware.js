const jwt = require('jsonwebtoken')
const hashedSecret = require('../crypto/config');



function generateToken(user) {
    return jwt.sign({ user: user.id }, hashedSecret, { expiresIn: '1h' });
}


function verifyToken(req, res, next) {
    //const token = req.session.token;
    
    if (!req.session || !req.session.token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
    }
    
    //jwt.verify(token, 'tu_secreto_secreto', (err, decoded) => {
    jwt.verify(req.session.token, hashedSecret, (err, decoded) => {
    if (err) {
        return res.status(401).json({ message: 'Token inválido', error: err.message });
    }
    
    req.user = decoded.user;
    next();
    
    });
}

module.exports = { generateToken, verifyToken };
//const { generateToken, verifyToken } = require('/middlewares/authMiddleware.js');