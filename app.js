const express = require('express');
const cors = require('cors');
const feedbackRoutes = require('./routes/feedbackRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const memberRoutes = require('./routes/memberRoutes');
const postRoutes = require('./routes/postRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const app = express();


// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/chats', chatRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/posts/users', postRoutes);
app.use('/api/notifications', notificationRoutes);

module.exports = app;