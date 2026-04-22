const fs = require('fs');

const DATA_FILE = '/tmp/wishes.json';

function readWishes() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveWishes(wishes) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(wishes, null, 2), 'utf-8');
  } catch (err) {
    console.error(err);
  }
}

module.exports = function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Khởi tạo file nếu chưa có
  if (!fs.existsSync(DATA_FILE)) {
    saveWishes([]);
  }

  if (req.method === 'GET') {
    return res.status(200).json(readWishes());
  }

  if (req.method === 'POST') {
    const { name, phone, attending, guestCount, message } = req.body || {};

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Tên không được để trống.' });
    }

    const wish = {
      id: Date.now(),
      name: String(name).trim(),
      phone: String(phone || '').trim(),
      attending: attending || 'yes',
      guestCount: parseInt(guestCount) || 1,
      message: String(message || '').trim(),
      timestamp: new Date().toISOString()
    };

    const wishes = readWishes();
    wishes.unshift(wish);
    saveWishes(wishes);

    return res.status(201).json(wish);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
