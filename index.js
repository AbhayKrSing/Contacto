const express = require('express');
const authRoutes = require('./routes/auth');
const createContactRoutes = require('./routes/createContact');
const editContactRoutes = require('./routes/editContact');
const searchContactRoutes = require('./routes/searchContact');
const db = require("./config/db")
const app = express();
app.use(express.json());
const dotenv = require('dotenv');
dotenv.config();

db()

app.use('/auth', authRoutes);
app.use('/create-contact', createContactRoutes);
app.use('/edit-contact', editContactRoutes);
app.use('/search-contact', searchContactRoutes);
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started at ${process.env.PORT || 3000}`);
});
