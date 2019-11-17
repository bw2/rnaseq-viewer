#FROM bitnami/minideb:stretch
FROM alpine:3.10

RUN apk add --update python3 py-pip

RUN python3 -m pip install gunicorn django

COPY ui/dist /rnaseq-viewer/ui/dist
COPY api /rnaseq-viewer/
COPY static /rnaseq-viewer/
COPY utils /rnaseq-viewer/
COPY *.py /rnaseq-viewer/

CMD gunicorn -w 4 -c gunicorn_config.py wsgi:application


