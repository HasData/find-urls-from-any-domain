import time
import requests
import json

API_KEY = 'YOUR-API-KEY'

headers = {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json'
}

def start_crawl():
    payload = {
        "limit": 20,
        "urls": ["https://demo.nopcommerce.com"],
        "aiExtractRules": {
            "products": {
                "type": "list",
                "output": {
                    "title": {
                        "description": "title of product",
                        "type": "string"
                    },
                    "description": {
                        "description": "information about the product",
                        "type": "string"
                    },
                    "price": {
                        "description": "price of the product",
                        "type": "string"
                    }
                }
            }
        },
        "outputFormat": ["text", "json"]
    }

    response = requests.post(
        f"https://api.hasdata.com/scrapers/crawler/jobs",
        json=payload,
        headers=headers
    )
    response.raise_for_status()
    job_id = response.json().get("id")
    print(f"Started job with ID: {job_id}")
    return job_id

def poll_job(job_id):
    while True:
        response = requests.get(
            f"https://api.hasdata.com/scrapers/jobs/{job_id}",
            headers=headers
        )
        data = response.json()
        status = data.get("status")
        print(f"Job status: {status}")

        if status in ["finished", "failed", "cancelled"]:
            return data
        time.sleep(10)

def download_and_extract_urls(json_url,job_id):
    output_path = f"results_{job_id}.json"
    response = requests.get(json_url)
    response.raise_for_status()
    raw_data = response.json()
    urls = [entry["url"] for entry in raw_data if "url" in entry]
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(urls, f, indent=2)


    print(f"Saved to {output_path}")

def download_and_extract_ai_data(json_url, job_id):
    output_path = f"parsed_ai_results_{job_id}.json"
    response = requests.get(json_url)
    response.raise_for_status()
    raw_data = response.json()

    parsed = []
    for entry in raw_data:
        result = {"url": entry.get("url")}
        ai_raw = entry.get("aiResponse")
        if ai_raw:
            try:
                ai_data = json.loads(ai_raw)
                result.update(ai_data)
            except json.JSONDecodeError:
                result["ai_parse_error"] = True
        parsed.append(result)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(parsed, f, indent=2, ensure_ascii=False)

    print(f"Saved parsed AI data to {output_path}")



job_id = start_crawl()
result = poll_job(job_id)

json_link = result["data"]["json"]
download_and_extract_urls(json_link,job_id)
download_and_extract_ai_data(json_link, job_id)

