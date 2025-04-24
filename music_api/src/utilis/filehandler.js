// src/utils/fileHandler.js
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const basePath = path.join(__dirname, '../../media/songs');
    const genrePath = path.join(basePath, req.body.genre.toLowerCase());
    const artistPath = path.join(genrePath, req.body.artist.toLowerCase());
    
    fs.mkdirSync(artistPath, { recursive: true });
    cb(null, artistPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.originalname}-${uniqueSuffix}`);
  }
});

const upload = multer({ storage });

async function saveSong(file, genre, artist) {
  const basePath = path.join(__dirname, '../../media/songs');
  const genrePath = path.join(basePath, genre);
  const artistPath = path.join(genrePath, artist);
  
  await fs.mkdir(artistPath, { recursive: true });
  return path.join(genrePath, artist, file.filename);
}

module.exports = { upload, saveSong };