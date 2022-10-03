# Note: Run this script from the root of the repo

import traceback
import logging
import requests
import json
from urllib.parse import urlparse
import re
from colorama import Fore, Style
import socket

mightyList = {}
config = {}

startRegex = r"https?:\/{2}(?:[^\s\/]+\.)+"
endRegex = "(?:\/[^\s\/]+)*\/?"
torRegex = startRegex + "onion" + endRegex
i2pRegex = startRegex + "i2p" + endRegex
lokiRegex = startRegex + "loki" + endRegex
authRegex = r"https?:\/{2}\S+:\S+@(?:[^\s\/]+\.)+[a-zA-Z0-9]+" + endRegex

with open('./src/config/config.json', 'rt') as tmp:
    config['networks'] = json.load(tmp)['networks']


def filterLastSlash(urlList):
    tmp = {}
    for frontend in urlList:
        tmp[frontend] = {}
        for network in urlList[frontend]:
            tmp[frontend][network] = []
            for url in urlList[frontend][network]:
                if url.endswith('/'):
                    tmp[frontend][network].append(url[:-1])
                    print(Fore.YELLOW + "Fixed " + Style.RESET_ALL + url)
                else:
                    tmp[frontend][network].append(url)
    return tmp


def idnaEncode(urlList):
    tmp = {}
    for frontend in urlList:
        tmp[frontend] = {}
        for network in urlList[frontend]:
            tmp[frontend][network] = []
            for url in urlList[frontend][network]:
                try:
                    encodedUrl = url.encode("idna").decode("utf8")
                    tmp[frontend][network].append(encodedUrl)
                    if (encodedUrl != url):
                        print(Fore.YELLOW + "Fixed " + Style.RESET_ALL + url)
                except Exception:
                    tmp[frontend][network].append(url)
    return tmp


def ip2bin(ip): return "".join(
    map(
        str,
        [
            "{0:08b}".format(int(x)) for x in ip.split(".")
        ]
    )
)


def get_cloudflare_ips():
    r = requests.get('https://www.cloudflare.com/ips-v4')
    return r.text.split('\n')


cloudflare_ips = get_cloudflare_ips()


def is_cloudflare(url):
    instance_ip = None
    try:
        instance_ip = socket.gethostbyname(urlparse(url).hostname)
        if instance_ip is None:
            return False
    except Exception:
        return False
    instance_bin = ip2bin(instance_ip)

    for cloudflare_ip_mask in cloudflare_ips:
        cloudflare_ip = cloudflare_ip_mask.split('/')[0]
        cloudflare_bin = ip2bin(cloudflare_ip)

        mask = int(cloudflare_ip_mask.split('/')[1])
        cloudflare_bin_masked = cloudflare_bin[:mask]
        instance_bin_masked = instance_bin[:mask]

        if cloudflare_bin_masked == instance_bin_masked:
            print(url + ' is behind ' + Fore.RED + 'cloudflare' + Style.RESET_ALL)
            return True
    return False


def is_authenticate(url):
    try:
        if re.match(authRegex, url):
            print(url + ' requires ' + Fore.RED + 'authentication' + Style.RESET_ALL)
            return True
        r = requests.get(url, timeout=5)
        if 'www-authenticate' in r.headers:
            print(url + ' requires ' + Fore.RED + 'authentication' + Style.RESET_ALL)
            return True
    except Exception:
        return False
    return False


def is_offline(url):
    try:
        r = requests.get(url, timeout=5)
        if r.status_code >= 400:
            print(url + ' is ' + Fore.RED + 'offline' + Style.RESET_ALL)
            print("Status code")
            print(r.status_code)
            return True
        else:
            return False
    except Exception:
        return False


def fetchCache(frontend, name):
    with open('./src/instances/data.json') as file:
        mightyList[frontend] = json.load(file)[frontend]
    print(Fore.YELLOW + 'Failed' + Style.RESET_ALL + ' to fetch ' + name)


def fetchFromFile(frontend, name):
    with open('./src/instances/' + frontend + '.json') as file:
        mightyList[frontend] = json.load(file)
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + name)


def fetchJsonList(frontend, name, url, urlItem):
    try:
        r = requests.get(url)
        rJson = json.loads(r.text)
        _list = {}
        for network in config['networks']:
            _list[network] = []
        if type(urlItem) == dict:
            for item in rJson:
                for network in config['networks']:
                    if urlItem[network] is not None:
                        if urlItem[network] in item:
                            if item[urlItem[network]].strip() != '':
                                _list[network].append(item[urlItem[network]])
        else:
            if frontend == 'librarian':
                rJson = rJson['instances']  # I got lazy :p   Might fix this at some point...
            for item in rJson:
                tmpItem = item
                if urlItem is not None:
                    tmpItem = item[urlItem]
                if tmpItem.strip() == '':
                    continue
                elif re.search(torRegex, tmpItem):
                    _list['tor'].append(tmpItem)
                elif re.search(i2pRegex, tmpItem):
                    _list['i2p'].append(tmpItem)
                elif re.search(lokiRegex, tmpItem):
                    _list['loki'].append(tmpItem)
                else:
                    _list['clearnet'].append(tmpItem)

        mightyList[frontend] = _list
        print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + name)
    except Exception:
        fetchCache(frontend, name)
        logging.error(traceback.format_exc())


def fetchRegexList(frontend, name, url, regex):
    try:
        r = requests.get(url)
        _list = {}
        for network in config['networks']:
            _list[network] = []

        tmp = re.findall(regex, r.text)

        for item in tmp:
            if item.strip() == "":
                continue
            elif re.search(torRegex, item):
                _list['tor'].append(item)
            elif re.search(i2pRegex, item):
                _list['i2p'].append(item)
            elif re.search(lokiRegex, item):
                _list['loki'].append(item)
            else:
                _list['clearnet'].append(item)
        mightyList[frontend] = _list
        print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + name)
    except Exception:
        fetchCache(frontend, name)
        logging.error(traceback.format_exc())


def fetchTextList(frontend, name, url, prepend):
    try:
        r = requests.get(url)
        tmp = r.text.strip().split('\n')

        _list = {}
        for network in config['networks']:
            _list[network] = []

        for item in tmp:
            item = prepend + item
            if re.search(torRegex, item):
                _list['tor'].append(item)
            elif re.search(i2pRegex, item):
                _list['i2p'].append(item)
            elif re.search(lokiRegex, item):
                _list['loki'].append(item)
            else:
                _list['clearnet'].append(item)
        mightyList[frontend] = _list
        print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + name)
    except Exception:
        fetchCache(frontend, name)
        logging.error(traceback.format_exc())


def invidious():
    name = 'Invidious'
    frontend = 'invidious'
    url = 'https://api.invidious.io/instances.json'
    try:
        _list = {}
        _list['clearnet'] = []
        _list['tor'] = []
        _list['i2p'] = []
        _list['loki'] = []
        r = requests.get(url)
        rJson = json.loads(r.text)
        for instance in rJson:
            if instance[1]['type'] == 'https':
                _list['clearnet'].append(instance[1]['uri'])
            elif instance[1]['type'] == 'onion':
                _list['tor'].append(instance[1]['uri'])
        mightyList[frontend] = _list
        print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + name)
    except Exception:
        fetchCache(frontend, name)
        logging.error(traceback.format_exc())


def piped():
    frontend = 'piped'
    name = 'Piped'
    try:
        _list = {}
        _list['clearnet'] = []
        _list['tor'] = []
        _list['i2p'] = []
        _list['loki'] = []
        r = requests.get(
            'https://raw.githubusercontent.com/wiki/TeamPiped/Piped/Instances.md')

        tmp = re.findall(
            r'(?:[^\s\/]+\.)+[a-zA-Z]+ (?:\(Official\) )?\| (https:\/{2}(?:[^\s\/]+\.)+[a-zA-Z]+) \| ', r.text)
        for item in tmp:
            try:
                url = requests.get(item, timeout=5).url
                if url.strip("/") == item:
                    continue
                else:
                    _list['clearnet'].append(url)
            except Exception:
                logging.error(traceback.format_exc())
                continue
        mightyList[frontend] = _list
        print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + name)
    except Exception:
        fetchCache(frontend, name)
        logging.error(traceback.format_exc())


def pipedMaterial():
    fetchRegexList('pipedMaterial', 'Piped-Material', 'https://raw.githubusercontent.com/mmjee/Piped-Material/master/README.md', r"\| (https?:\/{2}(?:\S+\.)+[a-zA-Z0-9]*) +\| Production")


def cloudtube():
    fetchFromFile('cloudtube', 'Cloudtube')


def proxitok():
    fetchRegexList('proxiTok', 'ProxiTok', 'https://raw.githubusercontent.com/wiki/pablouser1/ProxiTok/Public-instances.md', r"\| \[.*\]\(([-a-zA-Z0-9@:%_\+.~#?&//=]{2,}\.[a-z]{2,}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\)(?: \(Official\))? +\|(?:(?: [A-Z]*.*\|.*\|)|(?:$))")


def send():
    fetchRegexList('send', 'Send', 'https://gitlab.com/timvisee/send-instances/-/raw/master/README.md', r"- ([-a-zA-Z0-9@:%_\+.~#?&//=]{2,}\.[a-z0-9]{2,}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\)*\|*[A-Z]{0,}")


def nitter():
    fetchRegexList('nitter', 'Nitter', 'https://raw.githubusercontent.com/wiki/zedeus/nitter/Instances.md', r"(?:(?:\| )|(?:-   ))\[(?:(?:\S+\.)+[a-zA-Z0-9]+)\/?\]\((https?:\/{2}(?:\S+\.)+[a-zA-Z0-9]+)\/?\)(?:(?: (?:\((?:\S+ ?\S*)\) )? *\| [^❌]{1,4} +\|(?:(?:\n)|(?: ❌)|(?: ✅)|(?: ❓)|(?: \[)))|(?:\n))")


def bibliogram():
    fetchFromFile('bibliogram', 'Bibliogram')


def libreddit():
    fetchRegexList('libreddit', 'Libreddit', 'https://raw.githubusercontent.com/spikecodes/libreddit/master/README.md', r"\| \[.*\]\(([-a-zA-Z0-9@:%_\+.~#?&//=]{2,}\.[a-z]{2,}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\)*\|*[A-Z]{0,}.*\|.*\|")


def teddit():
    fetchJsonList('teddit', 'Teddit', 'https://codeberg.org/teddit/teddit/raw/branch/main/instances.json', {'clearnet': 'url', 'tor': 'onion', 'i2p': 'i2p', 'loki': None})


def wikiless():
    fetchJsonList('wikiless', 'Wikiless', 'https://wikiless.org/instances.json', {'clearnet': 'url', 'tor': 'onion', 'i2p': 'i2p', 'loki': None})


def scribe():
    fetchJsonList('scribe', 'Scribe', 'https://git.sr.ht/~edwardloveall/scribe/blob/main/docs/instances.json', None)


def quetre():
    fetchRegexList('quetre', 'Quetre', 'https://raw.githubusercontent.com/zyachel/quetre/main/README.md', r"\| \[.*\]\(([-a-zA-Z0-9@:%_\+.~#?&//=]{2,}\.[a-z0-9]{2,}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\)*\|*[A-Z]{0,}.*\|.*\|")


def libremdb():
    fetchRegexList('libremdb', 'libremdb', 'https://raw.githubusercontent.com/zyachel/libremdb/main/README.md', r"\| \[.*\]\(([-a-zA-Z0-9@:%_\+.~#?&//=]{2,}\.[a-z0-9]{2,}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\)*\|*[A-Z]{0,}.*\|.*\|")


def simpleertube():
    fetchTextList('simpleertube', 'SimpleerTube', 'https://simple-web.org/instances/simpleertube', 'https://')


def simplytranslate():
    r = requests.get('https://simple-web.org/instances/simplytranslate')
    simplyTranslateList = {}
    simplyTranslateList['clearnet'] = []
    for item in r.text.strip().split('\n'):
        simplyTranslateList['clearnet'].append('https://' + item)

    r = requests.get('https://simple-web.org/instances/simplytranslate_onion')
    simplyTranslateList['tor'] = []
    for item in r.text.strip().split('\n'):
        simplyTranslateList['tor'].append('http://' + item)

    r = requests.get('https://simple-web.org/instances/simplytranslate_i2p')
    simplyTranslateList['i2p'] = []
    for item in r.text.strip().split('\n'):
        simplyTranslateList['i2p'].append('http://' + item)

    r = requests.get('https://simple-web.org/instances/simplytranslate_loki')
    simplyTranslateList['loki'] = []
    for item in r.text.strip().split('\n'):
        simplyTranslateList['loki'].append('http://' + item)

    mightyList['simplyTranslate'] = simplyTranslateList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'SimplyTranslate')


def linvgatranslate():
    fetchJsonList('lingva', 'LingvaTranslate', 'https://raw.githubusercontent.com/TheDavidDelta/lingva-translate/main/instances.json', None)


def searx_searxng():
    r = requests.get('https://searx.space/data/instances.json')
    rJson = json.loads(r.text)
    searxList = {}
    searxList['clearnet'] = []
    searxList['tor'] = []
    searxList['i2p'] = []
    searxList['loki'] = []
    searxngList = {}
    searxngList['clearnet'] = []
    searxngList['tor'] = []
    searxngList['i2p'] = []
    searxngList['loki'] = []
    for item in rJson['instances']:
        if re.search(torRegex, item[:-1]):
            if (rJson['instances'][item].get('generator') == 'searxng'):
                searxngList['tor'].append(item[:-1])
            else:
                searxList['tor'].append(item[:-1])
        elif re.search(i2pRegex, item[:-1]):
            if (rJson['instances'][item].get('generator') == 'searxng'):
                searxngList['i2p'].append(item[:-1])
            else:
                searxList['i2p'].append(item[:-1])
        else:
            if (rJson['instances'][item].get('generator') == 'searxng'):
                searxngList['clearnet'].append(item[:-1])
            else:
                searxList['clearnet'].append(item[:-1])

    mightyList['searx'] = searxList
    mightyList['searxng'] = searxngList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'SearX, SearXNG')


def whoogle():
    fetchTextList('whoogle', 'Whoogle', 'https://raw.githubusercontent.com/benbusby/whoogle-search/main/misc/instances.txt', '')


def librex():
    fetchRegexList('librex', 'LibreX', 'https://raw.githubusercontent.com/hnhx/librex/main/README.md', r"\| {1,2}\[(?:(?:[a-zA-Z0-9]+\.)+[a-zA-Z]{2,}|✅)\]\((https?:\/{2}(?:[a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,})")


def rimgo():
    fetchJsonList('rimgo', 'rimgo', 'https://codeberg.org/video-prize-ranch/rimgo/raw/branch/main/instances.json', {'clearnet': 'url', 'tor': 'onion', 'i2p': 'i2p', 'loki': None})


def librarian():
    fetchJsonList('librarian', 'Librarian', 'https://codeberg.org/librarian/librarian/raw/branch/main/instances.json', 'url')


def neuters():
    fetchFromFile('neuters', 'Neuters')


def beatbump():
    fetchFromFile('beatbump', 'Beatbump')


def hyperpipe():
    fetchJsonList('hyperpipe', 'Hyperpipe', 'https://codeberg.org/Hyperpipe/pages/raw/branch/main/api/frontend.json', 'url')


def facil():
    fetchFromFile('facil', 'FacilMap')


def peertube():
    r = requests.get(
        'https://instances.joinpeertube.org/api/v1/instances?start=0&count=1045&sort=-createdAt')
    rJson = json.loads(r.text)

    myList = ['https://search.joinpeertube.org']
    for k in rJson['data']:
        myList.append('https://'+k['host'])

    mightyList['peertube'] = myList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'PeerTube')


def isValid(url):  # This code is contributed by avanitrachhadiya2155
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False


invidious()
piped()
pipedMaterial()
cloudtube()
proxitok()
send()
nitter()
bibliogram()
libreddit()
teddit()
wikiless()
scribe()
quetre()
libremdb()
simplytranslate()
linvgatranslate()
searx_searxng()
whoogle()
librex()
rimgo()
librarian()
neuters()
beatbump()
hyperpipe()
facil()
simpleertube()
mightyList = filterLastSlash(mightyList)
mightyList = idnaEncode(mightyList)

cloudflare = []
authenticate = []
offline = []
for k1, v1 in mightyList.items():
    if type(mightyList[k1]) is dict:
        for k2, v2 in mightyList[k1].items():
            for instance in mightyList[k1][k2]:
                if (not isValid(instance)):
                    mightyList[k1][k2].remove(instance)
                    print("removed " + instance)
                else:
                    if not instance.endswith('.onion') and not instance.endswith('.i2p') and not instance.endswith('.loki') and is_cloudflare(instance):
                        cloudflare.append(instance)
                    if not instance.endswith('.onion') and not instance.endswith('.i2p') and not instance.endswith('.loki') and is_authenticate(instance):
                        authenticate.append(instance)
                    if not instance.endswith('.onion') and not instance.endswith('.i2p') and not instance.endswith('.loki') and is_offline(instance):
                        offline.append(instance)

peertube()

blacklist = {
    'cloudflare': cloudflare,
    'authenticate': authenticate,
    'offline': offline
}

# Writing to file
json_object = json.dumps(mightyList, ensure_ascii=False, indent=2)
with open('./src/instances/data.json', 'w') as outfile:
    outfile.write(json_object)
print(Fore.BLUE + 'wrote ' + Style.RESET_ALL + 'instances/data.json')

json_object = json.dumps(blacklist, ensure_ascii=False, indent=2)
with open('./src/instances/blacklist.json', 'w') as outfile:
    outfile.write(json_object)
print(Fore.BLUE + 'wrote ' + Style.RESET_ALL + 'instances/blacklist.json')

# print(json_object)
