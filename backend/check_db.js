const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const { mongoUri } = require('./src/config/env');

const checkUsers = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to DB:', mongoUri);

        const users = await User.find({});
        console.log('Total Users:', users.length);
        console.log('Users:', JSON.stringify(users, null, 2));

        await mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
};

checkUsers();
