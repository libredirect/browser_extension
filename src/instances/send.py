import requests
import json
from urllib.parse import urlparse
from bs4 import BeautifulSoup

r = requests.get('https://gitlab.com/timvisee/send-instances/-/raw/master/README.md')
#soup = BeautifulSoup(r.text, 'html.parser')
tmp = r.text
for line in tmp.find('http'):
    print(line)
#instanceBeginning = soup.find('- https://')
#print(instanceBeginning)
