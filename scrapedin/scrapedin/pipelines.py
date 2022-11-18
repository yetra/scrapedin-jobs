# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
import fasttext
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem
from w3lib.html import remove_tags

PRETRAINED_MODEL = '../lid.176.ftz'


def clean_text(text):
    return remove_tags(text).strip()


def extract_lang_code(prediction):
    return prediction[0][0].split('__')[-1]


class LanguageIdentificationPipeline:
    lang_id_model = fasttext.load_model(PRETRAINED_MODEL)

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        description = adapter.get('description')

        if description:
            prediction = self.lang_id_model.predict(clean_text(description))
            adapter['lang_code'] = extract_lang_code(prediction)
        else:
            raise DropItem(f'Missing description in {item}')

        return item
