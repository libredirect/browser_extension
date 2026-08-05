import json
import os


langs = [
    'ar',
    'bn',
    'bs',
    'cs',
    'de',
    'eo',
    'es',
    'fi',
    'fr',
    'gl',
    'hi',
    'hr',
    'id',
    'it',
    'ja',
    'jv',
    'ko',
    'nb_NO',
    'nl',
    'pl',
    'pt',
    'pt_BR',
    'ro',
    'ru',
    'sr',
    'tr',
    'uk',
    'vi',
    'zh_Hans',
    'zh_Hant',
]
en_json = {}

with open('src/_locales/en/messages.json') as data:
    en_json = json.load(data)



for lang in langs:
    lang_json = {}
    lang_path = os.path.realpath('src/_locales/'+lang+'/messages.json')
    if not lang_path.startswith(os.path.realpath('src/_locales/')):
        raise ValueError(f"Path traversal detected for lang: {lang}")
    with open(lang_path) as data:
        lang_json = json.load(data)
        lang_json_new = {}
        for key in en_json:
            if key in lang_json:
                lang_json_new[key] = lang_json[key]
            else:
                lang_json_new[key] = en_json[key]
        with open(lang_path, 'w') as outfile:
            outfile.write(
                json.dumps(
                    lang_json_new,
                    ensure_ascii=False,
                    indent=4
                )
            )
