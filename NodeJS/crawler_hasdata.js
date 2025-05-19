const axios = require('axios');
const fs = require('fs/promises');

const API_KEY = 'YOUR-API-KEY';

const headers = {
  'x-api-key': API_KEY,
  'Content-Type': 'application/json'
};

const payload = {
  limit: 20,
  urls: ['https://demo.nopcommerce.com'],
  outputFormat: ['json']
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  try {
    const startRes = await axios.post(
      'https://api.hasdata.com/scrapers/crawler/jobs',
      payload,
      { headers }
    );

    const jobId = startRes.data.id;
    console.log(`Started job with ID: ${jobId}`);

    let status;
    let jobData;
    while (true) {
      const statusRes = await axios.get(
        `https://api.hasdata.com/scrapers/jobs/${jobId}`,
        { headers }
      );

      jobData = statusRes.data;
      status = jobData.status;
      console.log(`Job status: ${status}`);

      if (['finished', 'failed', 'cancelled'].includes(status)) {
        break;
      }

      await delay(10000);
    }

    if (status !== 'finished') {
      console.error(`Job ended with status: ${status}`);
      return;
    }

    const jsonUrl = jobData.data.json;
    const outputPath = `results_${jobId}.json`;

    const jsonRes = await axios.get(jsonUrl);
    const rawData = jsonRes.data;

    const urls = rawData
      .filter(entry => entry.url)
      .map(entry => entry.url);

    await fs.writeFile(outputPath, JSON.stringify(urls, null, 2), 'utf-8');
    console.log(`Saved to ${outputPath}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
