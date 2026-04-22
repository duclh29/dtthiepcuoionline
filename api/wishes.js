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
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Khởi tạo file tạm thời nếu chưa có
  if (!fs.existsSync(DATA_FILE)) {
    saveWishes([]);
  }

  if (req.method === 'GET') {
    return res.status(200).json(readWishes());
  } 
  
  if (req.method === 'POST') {
    const { name, phone, attending, guestCount, message } = req.body || {};
    
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
    wishes.unshift(wish);
    saveWishes(wishes);

    return res.status(201).json(wish);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
