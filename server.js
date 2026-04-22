const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3456;
const DATA_FILE = path.join(__dirname, 'data', 'wishes.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize wishes file if not exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

// Helper: read wishes
function readWishes() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Helper: save wishes
function saveWishes(wishes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(wishes, null, 2), 'utf-8');
}

// GET /api/wishes — return all wishes
app.get('/api/wishes', (req, res) => {
  const wishes = readWishes();
  res.json(wishes);
});

// POST /api/wishes — add a new wish
app.post('/api/wishes', (req, res) => {
  const { name, phone, attending, guestCount, message } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Tên không được để trống.' });
  }

  const wish = {
    id: Date.now(),
    name: name.trim(),
    phone: (phone || '').trim(),
    attending: attending || 'yes',
    guestCount: parseInt(guestCount) || 1,
    message: (message || '').trim(),
    timestamp: new Date().toISOString()
  };

  const wishes = readWishes();
  wishes.unshift(wish); // newest first
  saveWishes(wishes);

  res.status(201).json(wish);
});

app.listen(PORT, () => {
  console.log(`💍 Wedding server running at http://localhost:${PORT}`);
});
