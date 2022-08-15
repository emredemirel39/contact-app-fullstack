const bcrypt = require('bcrypt');
const User = require('../models/User');


exports.changePassword = async (req, res) => {

    try {
        
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
        const updatedUser = await User.findByIdAndUpdate({_id: req.params.id}, {password: hashedPassword});

        if (updatedUser === null) {
            res.status(400).json({status: false, message: 'User is cannot found!'});
        } else {
            res.status(200).json({status: true, data: updatedUser, message: 'Password changed'});
        };

    } catch (error) {

        if (error.name === "CastError") {
            const message = `Resource not found. Invalid ID`;
            return res.status(400).json({status: false, message: message});
        };

        res.status(500).json({status: false, message: error.message});
    };

};