import json
import os
import uuid

import crochet
crochet.setup()

import pandas as pd
from flask import Flask, render_template, request, session
from scrapy.crawler import CrawlerRunner, Crawler
from scrapy.utils.project import get_project_settings

from scrapedin.spiders.jobs_spider import JobsSpider

JOBS_DIR = 'jobs'

if not os.path.exists(JOBS_DIR):
    os.mkdir(JOBS_DIR)

app = Flask(__name__)
app.secret_key = os.environ.get(
    'SECRET_KEY',
    '78a372b5b6d435620e05123a509e4bab221e75c12e69e2091f095d8285e6cafe'
)

crawl_runner = CrawlerRunner()


def get_jobs_path(user_id):
    return f'{JOBS_DIR}/jobs_{user_id}.jsonl'


@app.route('/')
def index():
    return render_template('index.html')


@app.get('/search')
def search():
    user_id = session.pop('uuid', '')

    if os.path.exists(get_jobs_path(user_id)):
        os.remove(get_jobs_path(user_id))

    session['uuid'] = uuid.uuid4().hex

    return render_template('jobs.html')


@crochet.wait_for(timeout=60)
def scrape_jobs(params, jobs_path):
    settings = get_project_settings()
    settings.update({
        'FEEDS': {jobs_path: {'format': 'jsonlines'}}
    })
    crawler = Crawler(JobsSpider, settings)

    d = crawl_runner.crawl(
        crawler,
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
    jobs_path = get_jobs_path(session.get('uuid', ''))
    scrape_jobs(request.args, jobs_path)

    if not os.stat(jobs_path).st_size:
        return {}
    with open(jobs_path) as jsonl_file:
        return [json.loads(line) for line in jsonl_file]


@app.get('/filter')
def filter_jobs():
    jobs_path = get_jobs_path(session.get('uuid', ''))

    lang_code = request.args.getlist('lang_code[]')
    years = request.args.getlist('years_of_experience[]')

    if not os.stat(jobs_path).st_size:
        return {}
    df = pd.read_json(jobs_path, lines=True)

    if lang_code:
        df = df[df.lang_code.isin(lang_code)]
    if years:
        df = df[df.years_of_experience.isin(years)]

    json_string = df.to_json(orient='table', index=False)
    json_data = json.loads(json_string)['data']

    return json_data


if __name__ == '__main__':
    app.run()
