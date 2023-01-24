#!/bin/sh
python ./knok/manage.py makemigrations && python ./knok/manage.py migrate
python ./knok/manage.py runserver 0.0.0.0:8080
