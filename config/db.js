const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = 'mongodb+srv://trinhquoccongldb:cong1901!@cluster0.pthi6.mongodb.net/';
        await mongoose.connect(mongoURI,); // Loại bỏ các tùy chọn không cần thiết
        console.log('Connected to MongoDB Atlas!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
