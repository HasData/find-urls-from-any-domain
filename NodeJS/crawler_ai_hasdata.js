const axios = require('axios');
const fs = require('fs/promises');

const API_KEY = 'YOUR-API-KEY';

const headers = {
  'x-api-key': API_KEY,
  'Content-Type': 'application/json'
};

async function startCrawl() {
  const payload = {
    limit: 20,
    urls: ['https://demo.nopcommerce.com'],
    aiExtractRules: {
      products: {
        type: 'list',
        output: {
          title: {
            description: 'title of product',
            type: 'string'
          },
          description: {
            description: 'information about the product',
            type: 'string'
          },
          price: {
            description: 'price of the product',
            type: 'string'
          }
        }
      }
    },
    outputFormat: ['text', 'json']
  };

  const response = await axios.post(
    'https://api.hasdata.com/scrapers/crawler/jobs',
    payload,
    { headers }
  );

  const jobId = response.data.id;
  console.log(`Started job with ID: ${jobId}`);
  return jobId;
}

async function pollJob(jobId) {
  while (true) {
    const response = await axios.get(
      `https://api.hasdata.com/scrapers/jobs/${jobId}`,
      { headers }
    );
    const status = response.data.status;
    console.log(`Job status: ${status}`);

    if (['finished', 'failed', 'cancelled'].includes(status)) {
      return response.data;
    }

    await new Promise(resolve => setTimeout(resolve, 10000));
  }
}

async function downloadAndExtractUrls(jsonUrl, jobId) {
  const outputPath = `results_${jobId}.json`;
  const response = await axios.get(jsonUrl);
  const rawData = response.data;

  const urls = rawData
    .filter(entry => entry.url)
    .map(entry => entry.url);

  await fs.writeFile(outputPath, JSON.stringify(urls, null, 2), 'utf-8');
  console.log(`Saved to ${outputPath}`);
}

async function downloadAndExtractAiData(jsonUrl, jobId) {
  const outputPath = `parsed_ai_results_${jobId}.json`;
  const response = await axios.get(jsonUrl);
  const rawData = response.data;

  const parsed = rawData.map(entry => {
    const result = { url: entry.url };
    const aiRaw = entry.aiResponse;
    if (aiRaw) {
      try {
        const aiData = JSON.parse(aiRaw);
        Object.assign(result, aiData);
      } catch (err) {
        result.ai_parse_error = true;
      }
    }
    return result;
  });

  await fs.writeFile(outputPath, JSON.stringify(parsed, null, 2), 'utf-8');
  console.log(`Saved parsed AI data to ${outputPath}`);
}

(async () => {
  try {
    const jobId = await startCrawl();
    const result = await pollJob(jobId);
    const jsonUrl = result.data.json;
    await downloadAndExtractUrls(jsonUrl, jobId);
    await downloadAndExtractAiData(jsonUrl, jobId);
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
