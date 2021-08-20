const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pixi-test/index.html'));
});

// serve static images for sprites folder
app.use('/sprites', express.static(path.join(__dirname, 'pixi-test/sprites')));

app.listen(port);
console.log('Server started at http://localhost:' + port);
