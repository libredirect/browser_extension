import json


# langs = ['bs',  'cs',  'de',  'es', 'fr',  'gl',  'hr',  'id',  'it',  'ja',  'ko',
#  'nb_NO',  'nl',  'pl',  'pt',  'pt_BR',  'ro',  'ru',  'sr',  'tr',  'uk',  'vi', 'zh_Hans']
en_json = {}

with open('./en/messages.json') as data:
    en_json = json.load(data)

keys = ['extensionName',
        'extensionDescription',
        'general',
        'theme',
        'auto',
        'light',
        'dark',
        'excludeFromRedirecting',
        'importSettings',
        'exportSettings',
        'resetSettings',
        'enable',
        'showInPopup',
        'frontend',
        'redirectType',
        'both',
        'onlyEmbedded',
        'onlyNotEmbedded',
        'addYourFavoriteInstances',
        'switchInstance',
        'copyRaw',
        'copied',
        'settings',
        'about',
        'redirectToOriginal',
        'redirectLink',
        ]

tmp = {}

for key in en_json:
    if key in keys:
        tmp[key] = en_json[key]

en_json = tmp

with open('en/messages.json', 'w') as outfile:
    outfile.write(
        json.dumps(
            en_json,
            ensure_ascii=False,
            indent=4
        )
    )
