const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Contact = require('../models/contact');
const CryptoJS = require('crypto-js');
const { v4: uuidv4 } = require('uuid');

const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_SECRET).toString();
};
const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, process.env.ENCRYPTION_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
};


router.post('/', auth, async (req, res) => {
    const { name, phone, email, linkedin, twitter } = req.body;
    try {
        //checking duplicate
        let existingContactByName = null
        let existingContactByPhone = null;

        for (const contact of await Contact.find()) {
            if (decrypt(contact.name) === name) {
                existingContactByName = contact;
            }
            if (decrypt(contact.phone) === phone.toString()) {
                existingContactByPhone = contact;
            }
        }

        if (existingContactByName || existingContactByPhone) {
            return res.status(400).json({ error: 'Duplicate entry detected' });
        }

        const newContact = new Contact({
            id: uuidv4(),
            name: encrypt(name),
            phone: encrypt(phone.toString()),
            email: email ? encrypt(email) : null,
            linkedin: linkedin ? encrypt(linkedin) : null,
            twitter: twitter ? encrypt(twitter) : null
        });

        await newContact.save();
        res.json({ message: 'Contact created successfully' });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Failed to create contact' });
    }
});

module.exports = router;
