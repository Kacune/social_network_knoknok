INSTALATIONS
------------

Для установки и запуска данного приложения требуется:
Запустить установку библиотек из файла requirments.txt:


    pip install -r requirments.txt


Развернуть базу данных MySQL и прописать настройки подключения к ней в файле knoknok/settings.py

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'knoknok',
            'USER': 'root',
            'PASSWORD': 'root',
            'HOST': 'localhost'
        }
    }

После того как настройки базы данных и зависимости установлены необходимо сделать миграции в базу данных выполнив команду:

    python manage.py makemigrations
    python manage.py migrate

После того как все миграции выполнены можно запускать проект командой:

    python manage.py runserver

Также для работы чат-сервиса необходимо запустить сервер NodeJS

Для его работы требуется установить библиотеки из package.json

    npm install
    
Далее можно запустить файл server.js

    node server.js