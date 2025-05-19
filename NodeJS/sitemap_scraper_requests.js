const axios = require('axios');
const fs = require('fs');
const { parseStringPromise } = require('xml2js');

const sitemapUrl = 'https://demo.nopcommerce.com/sitemap.xml';
const outputFile = 'sitemap_links.txt';

(async () => {
  try {
    const response = await axios.get(sitemapUrl);
    const xml = response.data;

    const result = await parseStringPromise(xml);
    const urls = result.urlset.url.map(entry => entry.loc[0]);

    fs.writeFileSync(outputFile, urls.join('\n'), 'utf-8');
    console.log(`Saved ${urls.length} links to ${outputFile}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
