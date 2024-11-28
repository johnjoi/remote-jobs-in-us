const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON data
app.use(bodyParser.json());

// Serve static files (your webpage)
app.use(express.static('public'));

// Create Google Indexing API client
const indexer = google.indexing('v3');
const credentials = require('./path/to/your/service-account.json');

// Authenticate using the service account credentials
const authenticate = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });
  return await auth.getClient();
};

// API route to handle URL submissions for indexing
app.post('/submit-url', async (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const authClient = await authenticate();
    google.options({ auth: authClient });

    // Send the request to Google's Indexing API
    const request = {
      resource: {
        url: url,
        type: 'URL_UPDATED', // Or 'URL_DELETED' for deletion
      },
    };

    const response = await indexer.urlNotifications.publish(request);
    res.status(200).send('URL submitted for indexing');
  } catch (error) {
    console.error('Error submitting URL:', error);
    res.status(500).send('Error submitting URL');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
