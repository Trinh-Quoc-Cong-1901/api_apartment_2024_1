// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');


// Route gửi tin nhắn mới
router.post('/', async (req, res) => {
    try {
        const savedMessage = await chatController.sendMessage(req.body);
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route lấy tin nhắn giữa người dùng và admin
router.get('/:userId/:adminId', chatController.getMessages);

module.exports = router;
