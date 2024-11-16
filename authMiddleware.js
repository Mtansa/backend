// authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send('Token no proporcionado');

    jwt.verify(token,'miguel', (err, decoded) => {
        if (err) return res.status(200).send({ status:403,  msg:'Token inválido'});
        req.user = decoded;
        next();
    });
};
