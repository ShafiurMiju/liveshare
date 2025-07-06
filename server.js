const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const screenshotRoutes = require('./routes/screenshotRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', screenshotRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;

// --- Socket.IO Setup ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

let latestFrame = null;

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('screen-frame', (data) => {
    latestFrame = data;
    socket.broadcast.emit('viewer-frame', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('✅ Live screen share server is running.');
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('🚀 WebSocket server running on port ' + PORT);
});
