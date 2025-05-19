const axios = require("axios");
const fs = require("fs");
const xml2js = require("xml2js");

const apiKey = "YOUR-API-KEY";
const sitemapUrl = "https://demo.nopcommerce.com/sitemap.xml";

const url = "https://api.hasdata.com/scrape/web";

const payload = {
  url: sitemapUrl,
  proxyType: "datacenter",
  proxyCountry: "US"
};

const headers = {
  "Content-Type": "application/json",
  "x-api-key": apiKey
};

(async () => {
  try {
    const response = await axios.post(url, payload, { headers });
    const xmlContent = response.data.content;

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlContent);

    const urls = [];
    const urlEntries = result.urlset?.url || [];

    for (const entry of urlEntries) {
      if (entry.loc && entry.loc[0]) {
        urls.push(entry.loc[0]);
      }
    }

    fs.writeFileSync("output.json", urls.join("\n"), "utf-8");
    console.log("Links saved to output.json");
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
