const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    linkedin: { type: String },
    twitter: { type: String }
});

module.exports = mongoose.model('Contact', contactSchema);
