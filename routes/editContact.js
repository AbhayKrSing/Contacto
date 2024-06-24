const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Contact = require('../models/contact');
const CryptoJS = require('crypto-js');

const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_SECRET).toString();
};

const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, process.env.ENCRYPTION_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
};

router.put('/', auth, async (req, res) => {
    const { name, email, linkedin, twitter } = req.body;
    let userPresent = null
    for (const contact of await Contact.find()) {
        if (decrypt(contact.name) === name) {
            userPresent = contact.name;
            break;
        }
    }
    if (!userPresent) {
        return res.status(400).json({ error: 'User not present' });
    }
    try {
        const contact = await Contact.findOne({ name: userPresent });
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        if (email) contact.email = encrypt(email);
        if (linkedin) contact.linkedin = encrypt(linkedin);
        if (twitter) contact.twitter = encrypt(twitter);

        await contact.save();
        res.json({ message: 'Contact updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

module.exports = router;
