def extract_with_css(selector_obj, css_pattern):
    return selector_obj.css(css_pattern).get(default='').strip()


def remove_url_query_string(url):
    return url.split('?')[0]


class JobSelector:
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
