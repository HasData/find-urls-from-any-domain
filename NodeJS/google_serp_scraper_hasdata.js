const axios = require('axios');
const fs = require('fs');

const apiKey = 'YOUR-API-KEY';

const query = 'site:hasdata.com inurl:blog';
const location = 'Austin,Texas,United States';
const deviceType = 'desktop';
const numResults = 100;

const baseUrl = 'https://api.hasdata.com/scrape/google/serp';

const params = {
  q: query,
  location: location,
  deviceType: deviceType,
  num: numResults,
};

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': apiKey,
};

async function fetchSerp() {
  try {
    const response = await axios.get(baseUrl, { headers, params });
    const data = response.data.organicResults || [];
    const urls = data
      .filter(entry => entry.link)
      .map(entry => entry.link);

    const outputFile = 'serp.json';
    fs.writeFileSync(outputFile, JSON.stringify(urls, null, 2), 'utf-8');

    console.log(`Saved ${urls.length} URLs to ${outputFile}`);
  } catch (error) {
    console.error('Error fetching SERP data:', error.message);
  }
}

fetchSerp();
