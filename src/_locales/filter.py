import json


langs = ['bs',  'cs',  'de',  'es', 'fr',  'gl',  'hr',  'id',  'it',  'ja',  'ko',
         'nb_NO',  'nl',  'pl',  'pt',  'pt_BR',  'ro',  'ru',  'sr',  'tr',  'uk',  'vi', 'zh_Hans']
en_json = {}

with open('src/_locales/en/messages.json') as data:
    en_json = json.load(data)

for lang in langs:
    lang_json = {}
    with open('src/_locales/'+lang+'/messages.json') as data:
        lang_json = json.load(data)
        lang_json_new = {}
        for key in en_json:
            if key in lang_json:
                lang_json_new[key] = lang_json[key]
            else:
                lang_json_new[key] = en_json[key]
        with open('src/_locales/'+lang+'/messages.json', 'w') as outfile:
            outfile.write(
                json.dumps(
                    lang_json_new,
                    ensure_ascii=False,
                    indent=4
                )
            )
