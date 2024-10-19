const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Image upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Store for lost items
let items = [];

// Add item (POST)
app.post('/api/add', upload.single('image'), (req, res) => {
    const item = {
        name: req.body.name,
        contact: req.body.contact,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        category: req.body.category,
        thingName: req.body.thingName,
        image: req.file.filename,
    };

    items.push(item);
    res.status(200).send('Item added');
});

// Search for items (GET)
app.get('/api/search', (req, res) => {
    const { country, state, category } = req.query;

    const results = items.filter(item =>
        item.country === country &&
        item.state === state &&
        item.category === category
    );

    res.json(results);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
