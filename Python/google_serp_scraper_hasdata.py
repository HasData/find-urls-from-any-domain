import requests
import json

api_key = "YOUR-API-KEY"

query = "site:hasdata.com inurl:blog"
location = "Austin,Texas,United States"
device_type = "desktop"
num_results = 100

base_url = "https://api.hasdata.com/scrape/google/serp"

params = {
    "q": query,
    "location": location,
    "deviceType": device_type,
    "num": num_results
}

headers = {
    "Content-Type": "application/json",
    "x-api-key": api_key
}

response = requests.get(base_url, headers=headers, params=params)
response.raise_for_status()

data = response.json().get("organicResults", [])
urls = [entry["link"] for entry in data if "link" in entry]

output_file = "serp.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(urls, f, indent=2)

print(f"Saved {len(urls)} URLs to {output_file}")
