const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Contact = require('../models/contact');
const CryptoJS = require('crypto-js');

const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, process.env.ENCRYPTION_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
};

router.post('/', auth, async (req, res) => {
    const { search_token } = req.body;
    try {
        const contacts = await Contact.find();
        const results = contacts.filter(contact => {
            return new RegExp(search_token, "i").test(decrypt(contact.name));
        });
        if (results.length === 0) {
            return res.status(404).json({ error: 'No contacts found' });
        }
        const decryptedResults = results.map(contact => ({
            id: contact.id,
            name: decrypt(contact.name),
            phone: decrypt(contact.phone),
            email: contact.email ? decrypt(contact.email) : null,
            linkedin: contact.linkedin ? decrypt(contact.linkedin) : null,
            twitter: contact.twitter ? decrypt(contact.twitter) : null
        }));
        res.json(decryptedResults);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search contacts' });
    }
});

module.exports = router;
