import requests
import json
from urllib.parse import urlparse

r = requests.get(
    'https://instances.joinpeertube.org/api/v1/instances?start=0&count=1045&sort=-createdAt')
rJson = json.loads(r.text)

myList = []
for k in rJson['data']:
    myList.append(k['host'])
    
print(myList)
