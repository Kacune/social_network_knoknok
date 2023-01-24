FROM python:3.8
ENV DEBIAN_FRONTEND="noninteractive"

ENV PYTHONPATH=.

WORKDIR /code
COPY ./requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY ./ /code

CMD ["python", "mailer.py"]