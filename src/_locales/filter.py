import requests
import json
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import re
from colorama import Fore, Back, Style
from urllib.parse import urlparse
import socket
import subprocess


ar_json = {}
with open('ar/messages.json') as data:
    ar_json = json.load(data)


en_json = {}
with open('en/messages.json') as data:
    en_json = json.load(data)


remove_keys = []
for item in en_json.keys():
    if item not in ar_json.keys():
        remove_keys.append(item)

for item in remove_keys:
    en_json.pop(item)

add_keys = []
for item in ar_json.keys():
    if item not in en_json.keys():
        print(item)
        add_keys.append(item)

for item in add_keys:
    en_json[item] = {
        "message": "",
        "description": ""
    }

with open('en/messages.json', 'w') as outfile:
    outfile.write(json.dumps(en_json, ensure_ascii=False, indent=2))
