import scrapy


class JobsSpider(scrapy.Spider):
    name = 'jobs'

    def parse(self, response, **kwargs):
        pass
