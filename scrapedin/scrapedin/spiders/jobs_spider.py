import scrapy


class JobsSpider(scrapy.Spider):
    name = 'jobs'
    start_urls = [
        'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/'
        'search?keywords=Python&location=Croatia&start=0',
    ]

    def parse(self, response, **kwargs):
        def extract_with_css(selector_obj, css_pattern):
            return selector_obj.css(css_pattern).get(default='').strip()

        def remove_url_query_string(url):
            return url.split('?')[0]

        for job in response.css('li div.job-search-card'):
            info = job.css('div.base-search-card__info')[0]
            metadata = info.css('div.base-search-card__metadata')[0]

            link = remove_url_query_string(extract_with_css(job, 'a::attr(href)'))

            data = {
                'link': link,
                'icon_url': extract_with_css(job, 'div.search-entity-media img::attr(data-delayed-url)'),
                'title': extract_with_css(info, 'h3.base-search-card__title::text'),
                'subtitle': extract_with_css(info, 'h4.base-search-card__subtitle a::text'),
                'location': extract_with_css(metadata, 'span.job-search-card__location::text'),
                'listdate': extract_with_css(metadata, 'time::attr(datetime)'),
                'description': response.follow(link, callback=self.parse_description),
            }

            yield scrapy.Request(url=link, callback=self.parse_description, meta=data)

    def parse_description(self, response):
        description = response.css('div.description__text section div').get()
        response.meta['description'] = description

        yield response.meta
