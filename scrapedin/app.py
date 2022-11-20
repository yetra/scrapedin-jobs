import json
import os.path

import crochet
crochet.setup()

import pandas as pd
from flask import Flask, render_template, request
from scrapy.crawler import CrawlerRunner
from scrapy.utils.project import get_project_settings

from scrapedin.spiders.jobs_spider import JobsSpider

JOBS_PATH = 'jobs.json'

app = Flask(__name__)
crawl_runner = CrawlerRunner(get_project_settings())


@app.route('/')
def index():
    return render_template('index.html')


@app.get('/search')
def search():
    return render_template('jobs.html')


@crochet.wait_for(timeout=60)
def scrape_jobs(params):
    d = crawl_runner.crawl(
        JobsSpider,
        keywords=params.get('keywords', ''),
        location=params.get('location', ''),
        job_type=params.get('job_type', ''),
        experience_level=params.get('experience_level', ''),
        work_type=params.get('work_type', ''),
        start=params.get('start', '0'),
    )

    return d


@app.get('/jobs')
def jobs():
    scrape_jobs(request.args)

    if not os.stat(JOBS_PATH).st_size:
        return {}
    with open(JOBS_PATH) as json_file:
        return json.load(json_file)


@app.get('/filter')
def filter_jobs():
    lang_code = request.args.getlist('lang_code[]')
    years = request.args.getlist('years_of_experience[]')

    if not os.stat(JOBS_PATH).st_size:
        return {}
    df = pd.read_json(JOBS_PATH)

    if lang_code:
        df = df[df.lang_code.isin(lang_code)]
    if years:
        df = df[df.years_of_experience.isin(years)]

    json_string = df.to_json(orient='table', index=False)
    json_data = json.loads(json_string)['data']

    return json_data
