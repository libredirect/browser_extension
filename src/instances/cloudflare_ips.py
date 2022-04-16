# Note: Run this script from the root of the repo

import requests
import json
import subprocess
from colorama import Fore, Back, Style

def init_cloudflare():
    r = requests.get('https://www.cloudflare.com/ips-v4')
    myList = []
    for i in r.text.split('\n'):
        out = subprocess.run(
            ["sh", "./src/instances/get_possible_ips.sh", i],
            capture_output=True,
            text=True
        )
        myList += out.stdout.splitlines()
    print(Fore.GREEN + 'Fetched ' +
          Fore.RED + 'Cloudflare IPs' +
          Style.RESET_ALL)

    return myList

cloudflare_ips = init_cloudflare()
print(cloudflare_ips)

json_object = json.dumps(cloudflare_ips, ensure_ascii=False, indent=2)
with open('./src/instances/cloudflare_ips.json', 'w') as outfile:
    outfile.write(json_object)
print(Fore.BLUE + 'wrote ' + Style.RESET_ALL + 'instances/cloudflare_ips.json')