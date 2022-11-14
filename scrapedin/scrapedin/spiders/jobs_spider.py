import scrapy


class JobsSpider(scrapy.Spider):
    name = 'jobs'
    start_urls = [
        'https://www.linkedin.com/jobs/search?keywords=Python&location=Croatia'
    ]

    def parse(self, response, **kwargs):
        def extract_with_css(selector_obj, css_pattern):
            return selector_obj.css(css_pattern).get(default='').strip()

        def remove_url_query_string(url):
            return url.split('?')[0]

        for job in response.css('ul.jobs-search__results-list li'):
            info = job.css('div.base-search-card__info')[0]
            metadata = info.css('div.base-search-card__metadata')[0]

            yield {
                'link': remove_url_query_string(extract_with_css(job, 'a::attr(href)')),
                'title': extract_with_css(info, 'h3.base-search-card__title::text'),
                'subtitle': extract_with_css(info, 'h4.base-search-card__subtitle a::text'),
                'location': extract_with_css(metadata, 'span.job-search-card__location::text'),
                'listdate': extract_with_css(metadata, 'time::attr(datetime)')
            }
