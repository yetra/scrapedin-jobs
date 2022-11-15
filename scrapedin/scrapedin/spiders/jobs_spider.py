from enum import Enum
import scrapy

BASE_URL = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/' \
           'search?keywords=Python&location=Croatia'


def extract_with_css(selector_obj, css_pattern):
    return selector_obj.css(css_pattern).get(default='').strip()


def remove_url_query_string(url):
    return url.split('?')[0]


class JobSelector(Enum):
    BASE = 'li div.job-search-card'

    INFO = 'div.base-search-card__info'
    METADATA = 'div.base-search-card__metadata'

    URL = 'a.base-card__full-link::attr(href)'
    ICON_URL = 'div.search-entity-media img::attr(data-delayed-url)'

    TITLE = 'h3.base-search-card__title::text'
    SUBTITLE = 'h4.base-search-card__subtitle a::text'
    LOCATION = 'span.job-search-card__location::text'
    LIST_DATE = 'time::attr(datetime)'

    DESCRIPTION = 'div.description__text section div'


class JobsSpider(scrapy.Spider):
    name = 'jobs'

    num_scraped = 0
    start_urls = [f'{BASE_URL}&start={num_scraped}']

    def parse(self, response, **kwargs):
        for job in response.css(JobSelector.BASE):
            url = remove_url_query_string(extract_with_css(job, JobSelector.URL))

            info = job.css(JobSelector.INFO)[0]
            metadata = info.css(JobSelector.METADATA)[0]

            data = {
                'url': url,
                'icon_url': extract_with_css(job, JobSelector.ICON_URL),
                'title': extract_with_css(info, JobSelector.TITLE),
                'subtitle': extract_with_css(info, JobSelector.SUBTITLE),
                'location': extract_with_css(metadata, JobSelector.LOCATION),
                'listdate': extract_with_css(metadata, JobSelector.LIST_DATE),
                'description': response.follow(url, callback=self.parse_description),
            }

            yield scrapy.Request(url=url, callback=self.parse_description, meta=data)

    def parse_description(self, response):
        description = response.css(JobSelector.DESCRIPTION).get()
        response.meta['description'] = description

        yield response.meta
