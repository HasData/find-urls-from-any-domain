import requests
import xml.etree.ElementTree as ET

sitemap_url = "https://demo.nopcommerce.com/sitemap.xml"
output_file = "sitemap_links.txt"

response = requests.get(sitemap_url)
response.raise_for_status()

root = ET.fromstring(response.content)
namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
links = [loc.text for loc in root.findall('.//ns:loc', namespace)]

with open(output_file, 'w', encoding='utf-8') as f:
    for link in links:
        f.write(link + '\n')