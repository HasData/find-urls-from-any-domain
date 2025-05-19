![Python](https://img.shields.io/badge/python-3.10+-blue)
![Node.js](https://img.shields.io/badge/node.js-18+-green)


# Web Crawling & Scraping Examples (Python & Node.js)

This repository contains practical examples of website link collection using **Python** and **Node.js**. It covers different methods: from basic sitemap parsing with `requests` to crawling entire websites and scraping Google SERPs with HasData’s API.

## Table of Contents

1. [Requirements](#requirements)
2. [Project Structure](#project-structure)
3. [Scraping & Crawling Examples](#scraping--crawling-examples)
   * [Sitemap Scraping (Requests)](#sitemap-scraping-requests)
   * [Sitemap Scraping (HasData)](#sitemap-scraping-hasdata)
   * [Full Website Crawling (HasData)](#full-website-crawling-hasdata)
   * [Crawling with AI Extraction (HasData)](#crawling-with-ai-extraction-hasdata)
   * [Google SERP Scraping (HasData)](#google-serp-scraping-hasdata)

## Requirements

**Python 3.10+** or **Node.js 18+**

### Python Setup

Required packages:

* `requests`

Install:

```bash
pip install requests
```

### Node.js Setup

Required packages:

* `axios`

Install:

```bash
npm install axios
```

## Project Structure

```
web-scraping-examples/
│
├── python/
│   ├── sitemap_scraper_requests.py
│   ├── sitemap_scraper_hasdata.py
│   ├── crawler_hasdata.py
│   ├── crawler_ai_hasdata.py
│   ├── google_serp_scraper_hasdata.py
│
├── nodejs/
│   ├── sitemap_scraper_requests.js
│   ├── sitemap_scraper_hasdata.js
│   ├── crawler_hasdata.js
│   ├── crawler_ai_hasdata.js
│   ├── google_serp_scraper_hasdata.js
│
└── README.md
```

Each script is focused on a specific use case. No frameworks. Just clean and minimal examples to get things done.

## Scraping & Crawling Examples

### Sitemap Scraping (Requests)

A basic script that fetches and parses a sitemap XML using `requests` and `xml.etree.ElementTree`. No external services involved. Good for simple sites with clean sitemaps.

Change this data:

| Parameter     | Description                  | Example                                      |
| ------------- | ---------------------------- | -------------------------------------------- |
| `sitemap_url` | URL of the sitemap to scrape | `'https://demo.nopcommerce.com/sitemap.xml'` |
| `output_file` | File name to save links      | `'sitemap_links.txt'`                        |



### Sitemap Scraping (HasData)

Uses HasData's API to process a sitemap and extract links. Easier to scale, works even if the sitemap is large or spread across multiple files.

Change this data:

| Parameter    | Description                  | Example                                      |
| ------------ | ---------------------------- | -------------------------------------------- |
| `API_KEY`    | Your HasData API key         | `'111-1111-11-1'`                            |
| `sitemapUrl` | URL of the sitemap to scrape | `'https://demo.nopcommerce.com/sitemap.xml'` |


### Full Website Crawling (HasData)

Launches a full crawl of a website using HasData’s no-code crawler API. Useful when the sitemap is missing or incomplete. Returns all discovered URLs.

Change this data:

| Parameter       | Description                         | Example                            |
| --------------- | ----------------------------------- | ---------------------------------- |
| `API_KEY`       | Your HasData API key                | `'111-1111-11-1'`                  |
| `payload.limit` | Max number of links to collect      | `20`                               |
| `payload.urls`  | List of URLs to crawl               | `['https://demo.nopcommerce.com']` |
| `output_path`   | Filename to save the collected URLs | `'results_<job_id>.json'`          |



### Crawling with AI Extraction (HasData)

Same as above, but adds AI-powered content extraction. You can define what kind of data you want from each page using `aiExtractRules`. Great for structured scraping.

Change this data:

| Parameter        | Description                        | Example                   | 
| ---------------- | ---------------------------------- | ------------------------- | 
| `API_KEY`        | Your HasData API key               | `'111-1111-11-1'`         | 
| `urls`           | List of URLs to crawl              | `["https://example.com"]` | 
| `limit`          | Max number of pages to crawl       | `20`                      | 
| `aiExtractRules` | JSON schema for AI content parsing | See script                | 
| `outputFormat`   | Desired output format(s)           | `["json", "text"]`        | 

### Google SERP Scraping (HasData)

Sends a search query to HasData and gets back links from Google search results. No browser automation needed. Simple and fast way to collect SERP data.

Change this data:

| Parameter     | Description                | Example                         |
| ------------- | -------------------------- | ------------------------------- |
| `api_key`     | Your HasData API key       | `'YOUR-API-KEY'`                |
| `query`       | Search query for Google    | `'site:hasdata.com inurl:blog'` |
| `location`    | Search location            | `'Austin,Texas,United States'`  |
| `deviceType`  | Device type for search     | `'desktop'`                     |
| `num_results` | Number of results to fetch | `100`                           |
