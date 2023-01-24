import greenstalk
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header    import Header
import time
from os import getenv

class Mailer():

    def __init__(self):
        self.robot_mail = getenv('ROBOT_MAIL')
        self.domain = getenv('DOMAIN')
        self.protocol = getenv('PROTOCOL')
        self.api_version = getenv('API_VERTION')
        self.beanstalk =  greenstalk.Client((str(getenv('BEANSTALK_HOST')), int(getenv('BEANSTALK_PORT'))), watch='mailer')

    def sendMail(self, mail):
        msg = MIMEMultipart('alternative')
        msg['Subject'] = Header(mail['subject'], 'utf-8')
        msg['From'] = mail['from']
        msg['To'] = mail['to']
        msg.attach(MIMEText(mail['html'], 'html'))

        try:
            server = smtplib.SMTP_SSL(getenv('MAIL_SERVER'))
            server.login(getenv('MAIL_SERVER_USER'), getenv('MAIL_SERVER_PASSWORD'))
            server.sendmail(mail['from'], mail['to'], msg.as_string())

        except smtplib.SMTPException as err:
            print(err, flush=True)
        else:
            message = '{0} message sent to {1}\n'.format(time.strftime('%d.%m.%Y %H:%M:%S'), mail['to'])
            print(message, flush=True)
        finally:
            server.quit()

    def logger(self, file, message):
        file = open(file,'a')
        file.write(message)
        file.close()

    def sendConfirmationMail(self, email, code):
        message = {}
        message['subject'] = 'Вам выслан код подтверждения {0}'.format(self.domain)
        message['to'] = email
        message['from'] = self.robot_mail
        message['text'] = "Ваш код: {0}".format(code)
        message['html'] ='<html><body>Перейдите по <a href="{0}{1}/{2}/code/confirm/{3}" target="_blank" rel="noopener noreferrer">ссылке</a> для подтверждения регистрации.</body></html>'.format(self.protocol,self.domain,self.api_version,code)

        self.sendMail(message)

    def sendRecoveryMail(self, email, code):

        message = {}
        message['subject'] = 'Письмо для восстановления пароля {0}'.format(self.domain)
        message['to'] = email
        message['from'] = self.robot_mail
        message['text'] = "Ваш код: {0}".format(code)
        message['html'] = '<html><body>Перейдите по <a href="{0}{1}/user/password-recovery/form/{2}/{3}" target="_blank" rel="noopener noreferrer">ссылке</a> для восстановления пароля.</body></html>'.format(
            self.protocol, self.domain, code,email)

        self.sendMail(message)


mailer = Mailer()

with mailer.beanstalk as client:
    while True:
        job = client.reserve()
        message = json.loads(job.body.replace('\'','"'))

        print(message, flush=True)

        if message['task'] == 'confirmation_mail':
            mailer.sendConfirmationMail(message['to'], message['code'])
            print('!!!!', flush=True)
            client.delete(job)

        if message['task'] == 'recovery_mail':
            mailer.sendRecoveryMail(message['to'], message['code'])
            client.delete(job)
