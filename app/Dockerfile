FROM python:3.8.5
ENV DEBIAN_FRONTEND="noninteractive"
ENV PYTHONPATH=.
#ENV DB_HOST="knok-db"
#ENV DB_NAME="knok"
#ENV DB_USER="knok"
#ENV DB_PASSWORD="30333559"

WORKDIR /code
COPY ./requirements.txt ./
RUN apt update  \
    && apt install mariadb-client-10.3 -y

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY ./ /code
RUN ls
ENTRYPOINT ["sh", "entrypoint.sh"]