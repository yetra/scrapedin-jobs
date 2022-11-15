# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class JobItem(scrapy.Item):
    url = scrapy.Field()
    icon_url = scrapy.Field()

    title = scrapy.Field()
    subtitle = scrapy.Field()
    location = scrapy.Field()
    list_date = scrapy.Field()

    description = scrapy.Field()
