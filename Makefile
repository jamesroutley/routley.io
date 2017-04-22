.PHONY: clean clean-build

clean: clean-build

clean-build:
	bundle exec jekyll clean

build:  # Create the static and store it in _site/
	bundle exec jekyll build

deploy-prod: clean build  # Deploy the production website to S3
	aws s3 sync _site s3://jamesroutley.co.uk --delete

deploy-dev: clean build
	aws s3 sync _site s3://dev.jamesroutley.co.uk --delete

serve: clean
	bundle exec jekyll serve
