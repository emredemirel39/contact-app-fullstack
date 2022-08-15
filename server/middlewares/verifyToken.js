const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {

    const authHeader = await req.headers.authorization;
    
    try {

        if (authHeader) {
            const token = authHeader.split(" ")[1];

            jwt.verify(token, 'secretkey', (err, user) => {

                if (err) {
                    return res.status(403).json({status: false, message: 'Token is not valid'});
                };

                req.user = user;
                next();
            })            
        } else {
            res.status(403).json({status: false, message: "Token didn't found."})
        }
        
    } catch (error) {
        res.status(500).json({status: false, message: error.message});
    }

};

module.exports = verifyToken;