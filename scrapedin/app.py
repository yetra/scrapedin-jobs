import json

import pandas as pd
from flask import Flask, render_template, request
from scrapy.crawler import CrawlerRunner
from scrapy.utils.project import get_project_settings
from twisted.internet import reactor

from scrapedin.spiders.jobs_spider import JobsSpider

app = Flask(__name__)
crawl_runner = CrawlerRunner(get_project_settings())


@app.route('/')
def index():
    return render_template('index.html')


@app.get('/search')
def search():
    d = crawl_runner.crawl(
        JobsSpider,
        keywords=request.args.get('keywords', ''),
        location=request.args.get('location', ''),
        job_type=','.join(request.args.getlist('job_type')),
        experience_level=','.join(request.args.getlist('experience_level')),
        work_type=','.join(request.args.getlist('work_type')),
    )

    d.addBoth(lambda _: reactor.stop())
    reactor.run()

    return render_template('jobs.html')


@app.get('/jobs')
def jobs():
    with open('jobs.json') as json_file:
        return json.load(json_file)


@app.get('/filter')
def filter_jobs():
    lang_code = request.args.get('lang_code', '')
    years = request.args.getlist('years_of_experience')

    df = pd.read_json('jobs.json')

    if lang_code:
        df = df[df.lang_code == lang_code]
    if years:
        df = df[df.years_of_experience.isin(years)]

    json_string = df.to_json(orient='table', index=False)
    json_data = json.loads(json_string)['data']

    return json_data
