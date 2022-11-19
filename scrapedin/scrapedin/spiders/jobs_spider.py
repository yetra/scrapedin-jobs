import scrapy

from scrapedin.items import JobItem
from scrapedin.spiders.utils import JobSelector, remove_url_query_string, extract_with_css


class JobsSpider(scrapy.Spider):
    name = 'jobs'

    user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:107.0) Gecko/20100101 Firefox/107.0'

    num_scraped = 0
    base_url = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search'

    def start_requests(self):
        self.base_url += (
            f'?keywords={getattr(self, "keywords", "")}'
            f'&location={getattr(self, "location", "")}'
            f'&f_JT={getattr(self, "job_type", "")}'
            f'&f_E={getattr(self, "experience_level", "")}'
            f'&f_WT={getattr(self, "work_type", "")}'
        )

        yield scrapy.Request(
            url=f'{self.base_url}&start={self.num_scraped}',
            callback=self.parse
        )

    def parse(self, response, **kwargs):
        jobs = response.css(JobSelector.BASE)

        for job in jobs:
            url = remove_url_query_string(extract_with_css(job, JobSelector.URL))

            info = job.css(JobSelector.INFO)[0]
            metadata = info.css(JobSelector.METADATA)[0]

            item = JobItem(
                url=url,
                icon_url=extract_with_css(job, JobSelector.ICON_URL),
                title=extract_with_css(info, JobSelector.TITLE),
                subtitle=extract_with_css(info, JobSelector.SUBTITLE),
                location=extract_with_css(metadata, JobSelector.LOCATION),
                list_date=extract_with_css(metadata, JobSelector.LIST_DATE),
                list_date_text=extract_with_css(metadata, JobSelector.LIST_DATE_TEXT),
            )

            # scrape job description
            yield scrapy.Request(
                url=url,
                callback=self.parse_description,
                cb_kwargs=dict(item=item)
            )

        self.num_scraped += len(jobs)
        scrape_all = getattr(self, 'scrape_all', False)

        if scrape_all and jobs:
            # scrape more jobs
            yield scrapy.Request(
                url=f'{self.base_url}&start={self.num_scraped}',
                callback=self.parse
            )

    def parse_description(self, response, item):
        item['description'] = response.css(JobSelector.DESCRIPTION).get()

        yield item
