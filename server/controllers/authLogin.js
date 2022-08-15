const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.authLogin = async (req, res) => {

    
    const allUsers = await User.find();

    const user = allUsers?.find(user => user.phoneNumber === req.body.phoneNumber);
    
    try {

        if (user === undefined || user === null) {
            return res.status(400).json({status: false, message: 'Account not found or phone number is not correct!'});
        } else {
            const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        
            if (isPasswordCorrect === true) {

            // Generate token
            const token = jwt.sign({ id: user.id, phoneNumber: user.phoneNumber }, 'secretkey');

            res.status(200)
            .json({
                status: true, 
                data: user, 
                message: 'Welcome',
                token
            })
        } else {
            return res.status(401).json({status: false, message: 'Not Allowed, password is not correct!', data: user})
        }
        }

    } catch (error) {
        return res.status(500).json({status: false, message: error.message});
    };
};