const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin'); // Update path as needed
const dotenv = require('dotenv');

dotenv.config();

async function createAdmin() {
    try {
        await mongoose.connect("mongodb+srv://anishpdm:anishpdm@cluster0.cp5gozh.mongodb.net/visitor_entry_app", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const username = 'admin';
        const password = 'admin123';
        const name = 'Super Admin';

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            console.log('Admin already exists.');
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = new Admin({ name, username, password: hashedPassword });
            await newAdmin.save();
            console.log('Admin created successfully!');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Error creating admin:', err);
    }
}

createAdmin();
