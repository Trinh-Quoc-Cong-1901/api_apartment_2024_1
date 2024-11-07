require('dotenv').config(); // Đảm bảo dòng này được thêm vào đầu file

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Sử dụng biến môi trường để lấy chuỗi kết nối
        const mongoURI = process.env.MONGO_URI;
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB Atlas!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
