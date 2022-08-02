# Note: Run this script from the root of the repo

import requests
import json
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import re
from colorama import Fore, Back, Style
from urllib.parse import urlparse
import socket
import subprocess

mightyList = {}

startRegex = "https?:\/{2}(?:[^\s\/]+\.)+"
endRegex = "(?:\/[^\s\/]+)*\/?"
torRegex = startRegex + "onion" + endRegex
i2pRegex = startRegex + "i2p" + endRegex
lokiRegex = startRegex + "loki" + endRegex
authRegex = "https?:\/{2}\S+:\S+@(?:[^\s\/]+\.)+[a-zA-Z0-9]+" + endRegex

def filterLastSlash(urlList):
    tmp = {}
    for x in urlList:
        tmp[x] = {}
        for y in urlList[x]:
            tmp[x][y] = []
            for z in urlList[x][y]:
                if z.endswith('/'):
                    tmp[x][y].append(z[:-1])
                    print(Fore.YELLOW + "Fixed " + Style.RESET_ALL + z)
                else:
                    tmp[x][y].append(z)
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
    except:
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
    except:
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
    except:
        return False


def invidious():
    r = requests.get('https://api.invidious.io/instances.json')
    rJson = json.loads(r.text)
    invidiousList = {}
    invidiousList['normal'] = []
    invidiousList['tor'] = []
    invidiousList['i2p'] = []
    invidiousList['loki'] = []
    for instance in rJson:
        if instance[1]['type'] == 'https':
            invidiousList['normal'].append(instance[1]['uri'])
        elif instance[1]['type'] == 'onion':
            invidiousList['tor'].append(instance[1]['uri'])
    mightyList['invidious'] = invidiousList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Invidious')


def piped():
    r = requests.get(
        'https://raw.githubusercontent.com/wiki/TeamPiped/Piped/Instances.md')

    tmp = re.findall(
        '(?:[^\s\/]+\.)+[a-zA-Z]+ (?:\(Official\) )?\| (https:\/{2}(?:[^\s\/]+\.)+[a-zA-Z]+) \| ', r.text)
    _list = {}
    _list['normal'] = []
    _list['tor'] = []
    _list['i2p'] = []
    _list['loki'] = []
    for item in tmp:
        try:
            url = requests.get(item, timeout=5).url
            if url.strip("/") == item:
                continue
            else:
                _list['normal'].append(url)
        except:
            continue
    mightyList['piped'] = _list
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Piped')


def pipedMaterial():
    r = requests.get(
        'https://raw.githubusercontent.com/mmjee/Piped-Material/master/README.md')

    tmp = re.findall(
            r"\| (https?:\/{2}(?:\S+\.)+[a-zA-Z0-9]*) +\|", r.text)
    pipedMaterialList = {}
    pipedMaterialList['normal'] = []
    pipedMaterialList['tor'] = []
    pipedMaterialList['i2p'] = []
    pipedMaterialList['loki'] = []
    for item in tmp:
        pipedMaterialList['normal'].append(item)
    mightyList['pipedMaterial'] = pipedMaterialList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'pipedMaterial')


def cloudtube():
    json_object = json.dumps(mightyList, ensure_ascii=False, indent=2)
    with open('./src/instances/cloudtube.json') as file:
        mightyList['cloudtube'] = json.load(file)
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'CloudTube')


def proxitok():
    r = requests.get(
        'https://raw.githubusercontent.com/wiki/pablouser1/ProxiTok/Public-instances.md')

    tmp = re.findall(
        r"\| \[.*\]\(([-a-zA-Z0-9@:%_\+.~#?&//=]{2,}\.[a-z]{2,}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\)*\|*[A-Z]{0,}.*\|.*\|", r.text)
    proxiTokList = {}
    proxiTokList['normal'] = []
    proxiTokList['tor'] = []
    proxiTokList['i2p'] = []
    proxiTokList['loki'] = []
    for item in tmp:
        proxiTokList['normal'].append(re.sub(r'/$', '', item))
    mightyList['proxiTok'] = proxiTokList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'ProxiTok')


def send():
    r = requests.get(
        'https://gitlab.com/timvisee/send-instances/-/raw/master/README.md')
    tmp = re.findall(
        r"- ([-a-zA-Z0-9@:%_\+.~#?&//=]{2,}\.[a-z0-9]{2,}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\)*\|*[A-Z]{0,}", r.text)
    sendList = {}
    sendList['normal'] = []
    sendList['tor'] = []
    sendList['i2p'] = []
    sendList['loki'] = []
    for item in tmp:
        sendList['normal'].append(item)
    mightyList['send'] = sendList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Send')


def nitter():
    r = requests.get('https://raw.githubusercontent.com/wiki/zedeus/nitter/Instances.md')
    tmp = re.findall(
        r"(?:(?:\| \[(?:\S+\.)+[a-zA-Z]+\]\((https?:\/{2}(?:\S+\.)+[a-zA-Z]+)\/?\) (?:\((?:\S+ ?\S*)\) )? *\| [^❌]{1,3} +\|(?:(?:\n)|(?: (?:❌)|(?: ✅)|(?: ❓)|(?: \[))))|(?:-   \[(?:\S+\.)+(?:(?:i2p)|(?:loki))\]\((https?:\/{2}(?:\S+\.)(?:(?:i2p)|(?:loki)))\/?\)))", r.text)

    nitterList = {}
    nitterList['normal'] = []
    nitterList['tor'] = []
    nitterList['i2p'] = []
    nitterList['loki'] = []
    for item in tmp:
        for i in item:
            if i == '':
                continue
            else:
                item = i
        if re.search(torRegex, item):
            nitterList['tor'].append(item)
        elif re.search(i2pRegex, item):
            nitterList['i2p'].append(item)
        elif re.search(lokiRegex, item):
            nitterList['loki'].append(item)
        else:
            nitterList['normal'].append(item)
    mightyList['nitter'] = nitterList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Nitter')


def bibliogram():
    r = requests.get('https://bibliogram.art/api/instances')
    rJson = json.loads(r.text)
    bibliogramList = {}
    bibliogramList['normal'] = []
    bibliogramList['tor'] = []
    bibliogramList['i2p'] = []
    bibliogramList['loki'] = []
    for item in rJson['data']:
        bibliogramList['normal'].append(item['address'])
    mightyList['bibliogram'] = bibliogramList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Bibliogram')


def libreddit():
    r = requests.get(
        'https://raw.githubusercontent.com/spikecodes/libreddit/master/README.md')
    libredditList = {}
    libredditList['normal'] = []
    libredditList['tor'] = []
    libredditList['i2p'] = []
    libredditList['loki'] = []

    tmp = re.findall(
        r"\| \[.*\]\(([-a-zA-Z0-9@:%_\+.~#?&//=]{2,}\.[a-z]{2,}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\)*\|*[A-Z]{0,}.*\|.*\|", r.text)

    for item in tmp:
        if re.search(torRegex, item):
            libredditList['tor'].append(item)
        else:
            libredditList['normal'].append(item)
    mightyList['libreddit'] = libredditList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'LibReddit')


def teddit():
    r = requests.get(
        'https://codeberg.org/teddit/teddit/raw/branch/main/instances.json')
    rJson = json.loads(r.text)
    tedditList = {}
    tedditList['normal'] = []
    tedditList['tor'] = []
    tedditList['i2p'] = []
    tedditList['loki'] = []
    for item in rJson:
        url = item['url']
        if url != '':
            tedditList['normal'].append(url)
        if 'onion' in item:
            onion = item['onion']
            if onion != '':
                tedditList['tor'].append(onion)

    mightyList['teddit'] = tedditList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Teddit')


def wikiless():
    r = requests.get('https://wikiless.org/instances.json')
    rJson = json.loads(r.text)
    wikilessList = {}
    wikilessList['normal'] = []
    wikilessList['tor'] = []
    wikilessList['i2p'] = []
    wikilessList['loki'] = []
    for item in rJson:
        if 'url' in item:
            if item['url'].strip() != "":
                wikilessList['normal'].append(item['url'])
        if 'onion' in item:
            if item['onion'].strip() != "":
                wikilessList['tor'].append(item['onion'])
        if 'i2p' in item:
            if item['i2p'].strip() != "":
                wikilessList['i2p'].append(item['i2p'])
    mightyList['wikiless'] = wikilessList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Wikiless')


def scribe():
    r = requests.get(
        'https://git.sr.ht/~edwardloveall/scribe/blob/main/docs/instances.json')
    rJson = json.loads(r.text)
    scribeList = {}
    scribeList['normal'] = []
    scribeList['tor'] = []
    scribeList['i2p'] = []
    scribeList['loki'] = []
    for item in rJson:
        scribeList['normal'].append(item)
    mightyList['scribe'] = scribeList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Scribe')


def quetre():
    r = requests.get(
        'https://raw.githubusercontent.com/zyachel/quetre/main/README.md')
    _list = {}
    _list['normal'] = []
    _list['tor'] = []
    _list['i2p'] = []
    _list['loki'] = []

    tmp = re.findall(
        r"\| \[.*\]\(([-a-zA-Z0-9@:%_\+.~#?&//=]{2,}\.[a-z]{2,}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\)*\|*[A-Z]{0,}.*\|.*\|", r.text)


    for item in tmp:
        if re.search(torRegex, item):
            _list['tor'].append(item)
        else:
            _list['normal'].append(item)
    mightyList['quetre'] = _list
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Quetre')


def libremdb():
    r = requests.get(
        'https://raw.githubusercontent.com/zyachel/libremdb/main/README.md')
    _list = {}
    _list['normal'] = []
    _list['tor'] = []
    _list['i2p'] = []
    _list['loki'] = []

    tmp = re.findall(
        r"\| ([-a-zA-Z0-9@:%_\+.~#?&//=]{2,}\.[a-z]{2,}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)*\|*[A-Z]{0,}.*\|.*\|", r.text)


    for item in tmp:
        if item.strip() == "":
            continue
        if re.search(torRegex, item):
            _list['tor'].append(item)
        else:
            _list['normal'].append(item)

    mightyList['libremdb'] = _list
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Libremdb')

def simpleertube():
    r = requests.get('https://simple-web.org/instances/simpleertube')
    _list = {}
    _list['normal'] = []
    _list['tor'] = []
    _list['i2p'] = []
    _list['loki'] = []
    for item in r.text.strip().split('\n'):
        _list['normal'].append('https://' + item)

    mightyList['simpleertube'] = _list
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'SimpleerTube')


def simplytranslate():
    r = requests.get('https://simple-web.org/instances/simplytranslate')
    simplyTranslateList = {}
    simplyTranslateList['normal'] = []
    for item in r.text.strip().split('\n'):
        simplyTranslateList['normal'].append('https://' + item)

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
    r = requests.get(
        'https://raw.githubusercontent.com/TheDavidDelta/lingva-translate/main/instances.json')
    rJson = json.loads(r.text)
    lingvaList = {}
    lingvaList['normal'] = []
    lingvaList['tor'] = []
    lingvaList['i2p'] = []
    lingvaList['loki'] = []
    for item in rJson:
        lingvaList['normal'].append(item)

    mightyList['lingva'] = lingvaList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'LinvgaTranslate')


def searx_searxng():
    r = requests.get('https://searx.space/data/instances.json')
    rJson = json.loads(r.text)
    searxList = {}
    searxList['normal'] = []
    searxList['tor'] = []
    searxList['i2p'] = []
    searxList['loki'] = []
    searxngList = {}
    searxngList['normal'] = []
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
                searxngList['normal'].append(item[:-1])
            else:
                searxList['normal'].append(item[:-1])

    mightyList['searx'] = searxList
    mightyList['searxng'] = searxngList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'SearX, SearXNG')


def whoogle():
    r = requests.get(
        'https://raw.githubusercontent.com/benbusby/whoogle-search/main/misc/instances.txt')
    tmpList = r.text.strip().split('\n')
    whoogleList = {}
    whoogleList['normal'] = []
    whoogleList['tor'] = []
    whoogleList['i2p'] = []
    whoogleList['loki'] = []
    for item in tmpList:
        if re.search(torRegex, item):
            whoogleList['tor'].append(item)
        elif re.search(torRegex, item):
            whoogleList['i2p'].append(item)
        else:
            whoogleList['normal'].append(item)
    mightyList['whoogle'] = whoogleList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Whoogle')


def librex():
    r = requests.get(
        'https://raw.githubusercontent.com/hnhx/librex/main/README.md')
    _list = {}
    _list['normal'] = []
    _list['tor'] = []
    _list['i2p'] = []
    _list['loki'] = []

    tmp = re.findall(
            r"\| {1,2}\[(?:(?:[a-zA-Z0-9]+\.)+[a-zA-Z]{2,}|✅)\]\((https?:\/{2}(?:[a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,})", r.text)

    for item in tmp:
        if item.strip() == "":
            continue
        elif re.search(torRegex, item):
            _list['tor'].append(item)
        elif re.search(i2pRegex, item):
            _list['i2p'].append(item)
        else:
            _list['normal'].append(item)
    mightyList['librex'] = _list
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Librex')


def rimgo():
    r = requests.get(
        'https://codeberg.org/video-prize-ranch/rimgo/raw/branch/main/instances.json')
    rJson = json.loads(r.text)
    rimgoList = {}
    rimgoList['normal'] = []
    rimgoList['tor'] = []
    rimgoList['i2p'] = []
    rimgoList['loki'] = []
    for item in rJson:
        if 'url' in item:
            rimgoList['normal'].append(item['url'])
        if 'onion' in item:
            rimgoList['tor'].append(item['onion'])
        if 'i2p' in item:
            rimgoList['i2p'].append(item['i2p'])
    mightyList['rimgo'] = rimgoList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Rimgo')


def librarian():
    r = requests.get(
        'https://codeberg.org/librarian/librarian/raw/branch/main/instances.json')
    rJson = json.loads(r.text)
    librarianList = {}
    librarianList['normal'] = []
    librarianList['tor'] = []
    librarianList['i2p'] = []
    librarianList['loki'] = []
    instances = rJson['instances']
    for item in instances:
        url = item['url']
        if url.strip() == "":
            continue
        elif re.search(torRegex, url):
            librarianList['tor'].append(url)
        elif re.search(i2pRegex, url):
            librarianList['i2p'].append(url)
        elif re.search(lokiRegex, url):
            librarianList['loki'].append(url)
        else:
            librarianList['normal'].append(url)
    mightyList['librarian'] = librarianList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Librarian')


def neuters():
    json_object = json.dumps(mightyList, ensure_ascii=False, indent=2)
    with open('./src/instances/neuters.json') as file:
        mightyList['neuters'] = json.load(file)
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Neuters')


def beatbump():
    json_object = json.dumps(mightyList, ensure_ascii=False, indent=2)
    with open('./src/instances/beatbump.json') as file:
        mightyList['beatbump'] = json.load(file)
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Beatbump')


def hyperpipe():
    r = requests.get(
        'https://codeberg.org/Hyperpipe/pages/raw/branch/main/api/frontend.json')
    rJson = json.loads(r.text)
    hyperpipeList = {}
    hyperpipeList['normal'] = []
    hyperpipeList['tor'] = []
    hyperpipeList['i2p'] = []
    hyperpipeList['loki'] = []
    for item in rJson:
        url = item['url']
        if url.strip() == "":
            continue
        elif re.search(torRegex, url):
            hyperpipeList['tor'].append(url)
        elif re.search(i2pRegex, url):
            hyperpipeList['i2p'].append(url)
        elif re.search(lokiRegex, url):
            hyperpipeList['loki'].append(url)
        else:
            hyperpipeList['normal'].append(url)
    mightyList['hyperpipe'] = hyperpipeList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'Hyperpipe')


def facil():
    json_object = json.dumps(mightyList, ensure_ascii=False, indent=2)
    with open('./src/instances/facil.json') as file:
        mightyList['facil'] = json.load(file)
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'FacilMap')


def peertube():
    r = requests.get(
        'https://instances.joinpeertube.org/api/v1/instances?start=0&count=1045&sort=-createdAt')
    rJson = json.loads(r.text)

    myList = []
    for k in rJson['data']:
        myList.append('https://'+k['host'])

    mightyList['peertube'] = myList
    print(Fore.GREEN + 'Fetched ' + Style.RESET_ALL + 'PeerTube')


def isValid(url):  # This code is contributed by avanitrachhadiya2155
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
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
