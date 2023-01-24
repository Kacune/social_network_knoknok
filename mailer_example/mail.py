#from colorama import Fore, Back, Style
import greenstalk
import json
client = greenstalk.Client(('127.0.0.1', 11300), use='mailer')

body = json.dumps({
    'task': 'confirmation_mail',
    'to': 'vadim_shadrin@mail.ru',
    'code': '2525'
})

try:
    client.put(body)
except Axception as e:
    print(e)
