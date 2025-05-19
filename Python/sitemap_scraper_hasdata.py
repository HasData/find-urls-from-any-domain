import requests
import json
import xml.etree.ElementTree as ET

api_key = "YOUR-API-KEY"
sitemap_url = "https://demo.nopcommerce.com/sitemap.xml"

url = "https://api.hasdata.com/scrape/web"

payload = json.dumps({
  "url": sitemap_url,
  "proxyType": "datacenter",
  "proxyCountry": "US"
})
headers = {
  'Content-Type': 'application/json',
  'x-api-key': api_key
}

response = requests.request("POST", url, headers=headers, data=payload)

root = ET.fromstring(response.json().get("content"))
namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
links = [loc.text for loc in root.findall('.//ns:loc', namespace)]

with open("output.json", 'w', encoding='utf-8') as f:
    for link in links:
        f.write(link + '\n')


