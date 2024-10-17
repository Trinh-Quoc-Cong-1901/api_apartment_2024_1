const app = require('./app');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');
// const ChatController = require('./controllers/chatController');
// Connect to MongoDB
connectDB();



// Tạo HTTP server và gắn socket.io
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Lắng nghe sự kiện kết nối socket
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Lắng nghe tin nhắn từ client
    socket.on('sendMessage', (data) => {
        io.emit('receiveMessage', data); // Gửi lại cho tất cả client
    });

    // Lắng nghe sự kiện ngắt kết nối
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
