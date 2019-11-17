docker-build:
	docker build -t gcr.io/macarthurlab-rnaseq/rnaseq-viewer:latest .

docker-push:
    docker push gcr.io/macarthurlab-rnaseq/rnaseq-viewer:latest .


