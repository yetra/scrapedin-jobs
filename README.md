# scrapedin-jobs

ScrapedIn Jobs is a web app for displaying LinkedIn job postings with additional filter options.

<img width="1552" alt="Index page" src="https://user-images.githubusercontent.com/41755907/203147979-d1cc78d5-8fa2-4066-8936-2ca250fa7891.png">

## Table of Contents

<!-- toc -->

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Search and filter options](#search-and-filter-options)
4. [Usage examples](#usage-examples)

<!-- toc stop -->

## Requirements

* ![Python 3.7+](https://www.python.org/downloads/)
* ![Flask](https://flask.palletsprojects.com/en/2.2.x/)
* ![Scrapy](https://scrapy.org/)
* ![Crochet](https://github.com/itamarst/crochet)
* ![pandas](https://pandas.pydata.org/)
* ![fastText](https://fasttext.cc/)


## Installation

Download or clone the `scrapedin-jobs` repository:
```
git clone https://github.com/yetra/scrapedin-jobs.git
```

Go to the root directory and install the project requirements:
```
pip install -r requirements.txt
```

Navigate to the `scrapedin` directory and start the Flask app:
```
flask run
```

## Search and filter options

### Search options

Supported LinkedIn search options:
* Keywords
* Location
* Job Type
  * `Full-time`
  * `Part-time`
  * `Contract`
  * `Temporary`
  * `Volunteer`
  * `Internship`
* Experience Level
  * `Internship`
  * `Entry level`
  * `Associate`
  * `Mid-Senior level`
  * `Director`
* Work Type
  * `On-site`
  * `Remote`
  * `Hybrid`

Search options can be combined, e.g. `Full-time` jobs of `Remote` or `Hybrid` work types.

### Filter options

Additional filter options determined based on job description:
* Language
  * `English`
  * `Croatian`
* Years of experience (only for English or Croatian descriptions!)
  * `Not given`
  * `1+` up to `9+` years

Filter options can be combined, e.g. `Croatian` job postings requiring `1+`, `2+` or `3+` years of experience.

#### Filter implementation

Langage is identified using ![fastText](https://fasttext.cc/docs/en/language-identification.html)'s compressed language identification model. The most likely label is taken as the predicted language. Even though the model can identify more than just `English` or `Croatian` job descriptions, those two language filter options are offered because they are the only ones supported by the years of experience filter.

Years of experience are extracted by matching the following pattern:
```python
yoe_pattern = r'(\d)\+? (?:years?|godin[ae])'
```
This matches strings such as `3+ years`, `1 year`, `4 godine`, `4+ godina`, `4+ godine`, `1 godina`, etc.

## Usage examples

Search for `Internship` or `Entry level` Software Engineer positions in Hamburg which are listed as `Remote`:

<img width="1552" alt="Search options" src="https://user-images.githubusercontent.com/41755907/203148048-efa946c7-a6ae-423c-bfd7-a2fabc1d3bee.png">
<img width="1552" alt="Loading search results" src="https://user-images.githubusercontent.com/41755907/203148101-dc1fd6cc-a4fa-4847-83c9-7cf1c8e66a83.png">
<img width="1552" alt="Search results 1" src="https://user-images.githubusercontent.com/41755907/203148156-bc06c165-291d-442a-8f04-ff6240729c3a.png">
<img width="1552" alt="Search results 2" src="https://user-images.githubusercontent.com/41755907/203148165-85cf846a-e60e-4598-8e22-4b5ebf7fd605.png">


Load more results:

<img width="1552" alt="Loading more search results 1" src="https://user-images.githubusercontent.com/41755907/203148290-79f0f946-509c-4e6e-846b-d42aabe1f58d.png">
<img width="1552" alt="Loading more search results 2" src="https://user-images.githubusercontent.com/41755907/203148304-21c05d65-a833-4750-9272-0c97f9a6a500.png">


Filter the given results by language:

<img width="1552" alt="Filtering by language" src="https://user-images.githubusercontent.com/41755907/203148371-37154b47-a0ed-4a35-8b4f-a1bae90376f0.png">


Filter the `English` results by years of experience:

<img width="1552" alt="Filtering by years of experience" src="https://user-images.githubusercontent.com/41755907/203148385-e59d18af-fe89-422c-8ced-ad4bf28b4e3d.png">


Loading more results after filtering (`English` with `2+` years of experience) keeps the new results filtered:

<img width="1552" alt="Loading more filtered results 1" src="https://user-images.githubusercontent.com/41755907/203148643-4a6f4991-4196-4950-acbb-b5b8144b6285.png">
<img width="1552" alt="jLoading more filtered results 2" src="https://user-images.githubusercontent.com/41755907/203148651-b7a2a531-bdcc-4782-a5d5-8cf3bb0c2a0e.png">


Searching for `Remote` `Internship` Java Developer jobs in Tallinn yields no results:

<img width="1552" alt="Empty search results" src="https://user-images.githubusercontent.com/41755907/203148780-92900b62-cd6a-4e02-b2a7-7249a3c78c47.png">
