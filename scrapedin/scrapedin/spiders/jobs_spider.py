import scrapy


class JobsSpider(scrapy.Spider):
    name = 'jobs'
    start_urls = [
        'https://www.linkedin.com/jobs/search?keywords=Python&location=Croatia'
    ]

    def parse(self, response, **kwargs):
        for job in response.css('ul.jobs-search__results-list li'):
            info = job.css('div.base-search-card__info')[0]
            metadata = info.css('div.base-search-card__metadata')[0]

            yield {
                'link': job.css('a::attr(href)').get(),
                'title': info.css('h3.base-search-card__title::text').get(),
                'subtitle': info.css('h4.base-search-card__subtitle::text').get(),
                'location': metadata.css('span.job-search-card__location::text').get(),
                'listdate': metadata.css('time::attr(datetime)').get()
            }
