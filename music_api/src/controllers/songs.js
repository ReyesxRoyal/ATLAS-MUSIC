// src/controllers/songs.js
/**
 * @openapi
 * components:
 *   schemas:
 *     Song:
 *       type: object
 *       required:
 *         - title
 *         - artist
 *         - genre
 *         - duration
 *       properties:
 *         title:
 *           type: string
 *           description: The song title
 *         artist:
 *           type: string
 *           description: The song artist
 *         genre:
 *           type: string
 *           description: The song genre
 *         duration:
 *           type: string
 *           description: The song duration in MM:SS format
 *         filePath:
 *           type: string
 *           description: The file path of the song
 *         uploadedBy:
 *           type: integer
 *           description: The ID of the user who uploaded the song
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the song was uploaded
 */

const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const fileHandler = require('../utils/fileHandler');

/**
 * @openapi
 * /songs:
 *   get:
 *     summary: Get all songs
 *     tags:
 *       - Songs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().populate('uploadedBy');
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @openapi
 * /songs:
 *   post:
 *     summary: Upload a new song
 *     tags:
 *       - Songs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - title
 *               - artist
 *               - genre
 *               - duration
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               genre:
 *                 type: string
 *               duration:
 *                 type: string
 *     responses:
 *       201:
 *         description: Song created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const { title, artist, genre, duration } = req.body;
    const filePath = await fileHandler.saveSong(
      req.files.file,
      genre.toLowerCase(),
      artist.toLowerCase()
    );
    
    const song = new Song({
      title,
      artist,
      genre,
      duration,
      filePath,
      uploadedBy: req.user.id
    });
    
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;