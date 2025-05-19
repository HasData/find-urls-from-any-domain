import time
import requests
import json

API_KEY = 'YOUR-API-KEY'

headers = {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json'
}

payload = {
    "limit": 20,
    "urls": ["https://demo.nopcommerce.com"],
    "outputFormat": ["json"]
}

response = requests.post(
    "https://api.hasdata.com/scrapers/crawler/jobs",
    json=payload,
    headers=headers
)
response.raise_for_status()
job_id = response.json().get("id")
print(f"Started job with ID: {job_id}")

while True:
    response = requests.get(
        f"https://api.hasdata.com/scrapers/jobs/{job_id}",
        headers=headers
    )
    data = response.json()
    status = data.get("status")
    print(f"Job status: {status}")

    if status in ["finished", "failed", "cancelled"]:
        break

    time.sleep(10)

json_url = data["data"]["json"]
output_path = f"results_{job_id}.json"

response = requests.get(json_url)
response.raise_for_status()
raw_data = response.json()

urls = [entry["url"] for entry in raw_data if "url" in entry]

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(urls, f, indent=2)

print(f"Saved to {output_path}")
