// Serve the "submit-url.html" page
const path = require('path');

app.get('/submit-url', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'submit-url.html'));
});
