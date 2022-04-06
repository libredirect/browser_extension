# Note: Run this script from the root of the repo

import requests
import json
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import re

mightyList = {}


def get_host_name(link):
    url = urlparse(link)
    return url.netloc


# Invidious
r = requests.get('https://api.invidious.io/instances.json')
rJson = json.loads(r.text)
invidiousList = {}
invidiousList['normal'] = []
invidiousList['tor'] = []
for instance in rJson:
    if instance[1]['type'] == 'https':
        invidiousList['normal'].append(instance[1]['uri'])
    elif instance[1]['type'] == 'onion':
        invidiousList['tor'].append(instance[1]['uri'])
mightyList['invidious'] = invidiousList
print('fetched Invidious')


# Nitter
r = requests.get('https://github.com/zedeus/nitter/wiki/Instances')
soup = BeautifulSoup(r.text, 'html.parser')
markdownBody = soup.find(class_='markdown-body')
tables = markdownBody.find_all('table')
tables.pop(3)
tables.pop(3)
nitterList = {}
nitterList['normal'] = []
nitterList['tor'] = []
for table in tables:
    tbody = table.find('tbody')
    trs = tbody.find_all('tr')
    for tr in trs:
        td = tr.find('td')
        a = td.find('a')
        url = a.contents[0]
        if url.endswith('.onion'):
            url = 'http://' + url
            nitterList['tor'].append(url)
        else:
            url = 'https://' + url
            nitterList['normal'].append(url)
mightyList['nitter'] = nitterList
print('fetched Nitter')

# Bibliogram
r = requests.get('https://bibliogram.1d4.us/api/instances')
rJson = json.loads(r.text)
bibliogramList = {}
bibliogramList['normal'] = []
bibliogramList['tor'] = []
for item in rJson['data']:
    bibliogramList['normal'].append(item['address'])
mightyList['bibliogram'] = bibliogramList
print('fetched Bibliogram')

# LibReddit
r = requests.get(
    'https://raw.githubusercontent.com/spikecodes/libreddit/master/README.md')
libredditList = {}
libredditList['normal'] = []
libredditList['tor'] = []
tmp = re.findall(
    r"\| \[.*\]\(([-a-zA-Z0-9@:%_\+.~#?&//=]{2,}\.[a-z]{2,}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\)*\|*[A-Z]{0,}.*\|.*\|", r.text)
for item in tmp:
    if item.endswith('.onion'):
        libredditList['tor'].append(item)
    else:
        libredditList['normal'].append(item)
mightyList['libreddit'] = libredditList
print('fetched LibReddit')

# Teddit
r = requests.get(
    'https://codeberg.org/teddit/teddit/raw/branch/main/instances.json')
rJson = json.loads(r.text)
tedditList = {}
tedditList['normal'] = []
tedditList['tor'] = []
for item in rJson:
    url = item['url']
    if url != '':
        tedditList['normal'].append(url)
    if 'onion' in item:
        onion = item['onion']
        if onion != '':
            tedditList['tor'].append(onion)

mightyList['teddit'] = tedditList
print('fetched Teddit')


# Wikiless
r = requests.get('https://wikiless.org/instances.json')
rJson = json.loads(r.text)
wikilessList = {}
wikilessList['normal'] = []
wikilessList['tor'] = []
for item in rJson:
    if item.endswith('.onion'):
        wikilessList['tor'].append('http://' + item)
    else:
        wikilessList['normal'].append('https://' + item)
mightyList['wikiless'] = wikilessList
print('fetched Wikiless')

# Scribe
r = requests.get(
    'https://git.sr.ht/~edwardloveall/scribe/blob/main/docs/instances.json')
rJson = json.loads(r.text)
scribeList = {}
scribeList['normal'] = []
scribeList['tor'] = []
for item in rJson:
    scribeList['normal'].append(item)
mightyList['scribe'] = scribeList
print('fetched Scribe')


# SimplyTranslate
r = requests.get('https://simple-web.org/instances/simplytranslate')
simplyTranslateList = {}
simplyTranslateList['normal'] = []
for item in r.text.strip().split('\n'):
    simplyTranslateList['normal'].append('https://' + item)

r = requests.get('https://simple-web.org/instances/simplytranslate_onion')
simplyTranslateList['tor'] = []
for item in r.text.strip().split('\n'):
    simplyTranslateList['tor'].append('http://' + item)

mightyList['simplyTranslate'] = simplyTranslateList
print('fetched SimplyTranslate')

# LinvgaTranslate
r = requests.get(
    'https://raw.githubusercontent.com/TheDavidDelta/lingva-translate/main/instances.json')
rJson = json.loads(r.text)
lingvaList = {}
lingvaList['normal'] = []
lingvaList['tor'] = []
for item in rJson:
    lingvaList['normal'].append(item)
mightyList['lingva'] = lingvaList
print('fetched LinvgaTranslate')


# SearX, SearXNG
r = requests.get('https://searx.space/data/instances.json')
rJson = json.loads(r.text)
searxList = {}
searxList['tor'] = []
searxList['i2p'] = []
searxList['normal'] = []
searxngList = {}
searxngList['tor'] = []
searxngList['i2p'] = []
searxngList['normal'] = []
for item in rJson['instances']:
    if item[:-1].endswith('.onion'):
        if (rJson['instances'][item].get('generator') == 'searxng'):
            searxngList['tor'].append(item[:-1])
        else:
            searxList['tor'].append(item[:-1])
    elif item[:-1].endswith('.i2p'):
        if (rJson['instances'][item].get('generator') == 'searxng'):
            searxngList['i2p'].append(item[:-1])
        else:
            searxList['i2p'].append(item[:-1])
    else:
        if (rJson['instances'][item].get('generator') == 'searxng'):
            searxngList['normal'].append(item[:-1])
        else:
            searxList['normal'].append(item[:-1])

mightyList['searx'] = searxList
mightyList['searxng'] = searxngList
print('fetched SearX, SearXNG')

# Whoogle
r = requests.get(
    'https://raw.githubusercontent.com/benbusby/whoogle-search/main/misc/instances.txt')
tmpList = r.text.strip().split('\n')
whoogleList = {}
whoogleList['normal'] = []
whoogleList['tor'] = []
for item in tmpList:
    whoogleList['normal'].append(item)
mightyList['whoogle'] = whoogleList
print('fetched Whoogle')


# Rimgo
r = requests.get(
    'https://codeberg.org/video-prize-ranch/rimgo/raw/branch/main/instances.json')
rJson = json.loads(r.text)
rimgoList = {}
rimgoList['normal'] = []
rimgoList['tor'] = []

for item in rJson:
    if item.endswith('.onion'):
        rimgoList['tor'].append('http://' + item)
    else:
        rimgoList['normal'].append('https://' + item)
mightyList['rimgo'] = rimgoList
print('fetched Rimgo')

# Peertube
r = requests.get(
    'https://instances.joinpeertube.org/api/v1/instances?start=0&count=1045&sort=-createdAt')
rJson = json.loads(r.text)

myList = []
for k in rJson['data']:
    myList.append('https://'+k['host'])

mightyList['peertube'] = myList
print('fetched Peertube')


# Writing to file
json_object = json.dumps(mightyList, ensure_ascii=False, indent=2)
with open('./src/instances/data.json', 'w') as outfile:
    outfile.write(json_object)
# print(json_object)
print('wrote instances/data.json')
