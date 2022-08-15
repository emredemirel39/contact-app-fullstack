const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const verifyToken = require('../middlewares/verifyToken');
const jwt = require('jsonwebtoken');
const { changePassword } = require('../controllers/changePassword');
const { authLogin } = require('../controllers/authLogin');


// GET ALL

router.get('/', async (req, res) => {
    
    try {

        const users = await User.find();

        switch (users) {
            case null:
                res.status(200).json({status: true, message: 'There is not exists users yet.', data: null});
                break;
        
            default:
                res.status(200).json({ status: true, data: users });
                break;
        }
    } catch (error) {
        res.status(500).json({status: false, message: error.message});
    };
});


// CREATE ONE

router.post('/register', async (req, res) => {

    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        const user = new User({
            ...req.body, password: hashedPassword
        });
        
        const newUser = await user.save();

        const token = jwt.sign({ id: newUser.id, phoneNumber: newUser.phoneNumber }, 'secretkey');

        return res.status(201).json({status: true, data: newUser, token: token, message: `Welcome.`})
    } catch (err) {

        if (err.code === 11000) {
            return res.status(400).json({status: false, message: 'User already exists'});
            
        };

        return res.status(500).json({status: false, message: err.message});
    }
})

// GET ONE

router.get('/:id', verifyToken, async (req, res) => {
    
    try {

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({status: false, message: `Resource not found. Invalid ID`});
        }

        if (req.user.id === user.id) {
            res.status(200).json({status: true, data: user});
        } else {
            res.status(403).json({ status: false, message: 'You are allowed to change only your own account' });
        }
        
    } catch (error) {

        if (error.name === "CastError") {
            const message = `Resource not found. Invalid ID`;
            return res.status(400).json({status: false, message: message});
        };
          
        res.status(500).json({status: false, message: error.message});
    };
});

// DELETE ACCOUNT

 router.delete('/:id', verifyToken, async (req, res) => {

    //console.log(req.user);

    try {
        
        if (req.user.id === req.params.id) {
            
            const user = await User.findByIdAndRemove(req.params.id);

            if (!user) {
                return res.status(400).json({status: false, message: `Resource not found. Invalid ID`})
            }
            res.status(204).end();
        } else {
            res.status(403).json({status: false, message: 'You are not allowed to delete'})
        }   
        
    } catch (error) {

        if (error.name === "CastError") {
            const message = `Resource not found. Invalid ID`;
            return res.status(400).json({status: false, message: message});
        };
          
        res.status(500).json({status: false, message: error.message});
    };

});



// LOGIN

router.post('/login', authLogin);

// LOGIN VIA TOKEN

router.post('/login-token', verifyToken, async (req, res) => {

    const user = await User.findById(req.user.id);

    try {

        user && res.status(200).json({ status: true, data: user }).end();

        if (user === undefined || user === null) {
            return res.status(401).json({ status: false, message: 'Cannot find user' });
        }
        
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }

})

// LOGOUT

router.post('/:id/logout', verifyToken, async (req, res) => {
    if (req.user.id === req.params.id) {
        res.status(204).end();
    } else {
        res.status(403).json({ status: false, message: 'You are allowed to change only your own account' });
    }
});

// UPDATE ONE

router.patch('/:id', verifyToken, async (req, res) => {

    if(!req.body) {
        return res.status(400).json({status: false, message: 'User data to update cannot be empty'});
    }

    try {
        const user = await User.findById(req.params.id)

        if (req.user.id === user.id) {
            
            Object.assign(user, req.body)
            user.save();
            res.status(200).json({status: true, data: user})
        } else {
            res.status(403).json({ status: false, message: 'You are allowed to change only your own account' });
        }

    } catch (error) {
        if (error.name === "CastError") {
            const message = `Resource not found. Invalid ID`;
            return res.status(400).json({status: false, message: message});
          };
          
        res.status(500).json({status: false, message: error.message});
    };
})

// CHANGE PASSWORD

router.patch('/:id/change-password', verifyToken, changePassword);

module.exports = router;