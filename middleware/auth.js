const jwt = require('jsonwebtoken');

/* take token from request header, compare the client userId and the token userId */
module.exports = (req, res, next) => {
    try {

        // header dans la requete ==> authorization : 'Bearer xxxxxxxxx';
        
        // Extraire le token de l'entête
        const token = req.headers.authorization.split(' ')[1];

        // Vérifier le token
        const decodeToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

        // Assigner l'id aux variables locales de réponse
        const _id = decodeToken._id;
        res.locals._id = _id;
        next();

    } catch (error) {
        res.status(401).json({ error : error | 'Authentification failed !'});
    }
};