const router = require('express').Router();
const Contact = require('../models/Contact');
const verifyToken = require('../middlewares/verifyToken');

// Get All

router.get('/', verifyToken, async (req, res) => {
    
    try {

        const contacts = await Contact.find({ownerId: req.user.id})

        if (contacts === null) {
            res.status(200).json({status: true, message: 'There is not exists events yet!'});
        }

        res.status(200).json({status: true, data: contacts});

    } catch (error) {
        
        res.status(500).json({status: false, message: error.message});
    };
}) ;

// Create One

router.post('/', verifyToken, async (req, res) => {

    try {

        const newContact = await new Contact({...req.body, ownerId: req.user.id}).save();

        if (!newContact) {
            res.status(400).json({status: false, message: 'You are not entered any data to add'}).end()
        }

        res.status(201).json({status: true, data: newContact, message: `Added new contact`})
        
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({status: false, message: error.message});
            
        };

        res.status(500).json({status: false, message: error.message});
    }
})

// Delete One

router.delete('/:id', verifyToken, async (req, res) => {

    try {

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            res.status(401).json({ status: false, message: 'Resource not found. Invalid ID' });
            return;
        };

        if (req.user.id === contact.ownerId) {
            const deletedContact = await Contact.findByIdAndDelete(req.params.id);
            return res.status(202).json({status: true, message: 'Contact successfully deleted'});
        } else {
            return res.status(403).json({status: false, message: 'You are not allowed to delete this contact'})
        }
        
    } catch (error) {
        res.status(500).json({status: false, message: error.message});
    };
});

// Get One

router.get('/:id', verifyToken, async (req, res) => {

    try {

        const contact = await Contact.findById(req.params.id)

        if (!contact) {
            
            return res.status(400).json({status: false, message: 'Resource not found. Invalid ID'})
        }
        
        if (req.user.id === contact.ownerId) {
            return res.status(200).json({status: true, data: contact});
        } else {
            return res.status(403).json({ status: false, message: 'You are not allowed to see this contact' });
        }
        
    } catch (error) {

        if (error.name === 'CastError') {
            const message = 'Resource not found. Invalid ID'
            return res.status(400).json({status: false, message});
        }
        
        return res.status(500).json({status: false, message: error.message});
    };

});

// Update One

router.patch('/:id',verifyToken, async (req, res) => {

    if (!req.body) {
        return res.status(400).json({status:false, message: 'Cannot find event'})
    };

    try {

        const contact = await Contact.findById(req.params.id)

        if (req.user.id === contact.ownerId) {
            const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body);
            await updatedContact.save()

            return res.status(200).json({ status: true, data: updatedContact });
        } else {
            return res.status(403).json({ status: false, message: 'You are not allowed to change this contact' });
        }

    } catch (error) {
        return res.status(500).json({status: false, message: error.message});
    };
});

module.exports = router;