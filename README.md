# Daily Report API

NodeJS API for creating reports from scripts.  I was playing around with the [N8N Project]() and wanted to come up with a way to generate and store reports from those automation tasks and view them at a later date.  This API will serve as the aggregation and HTML report generator.

## Setup

The application is deployed as a docker image so you can just pull the image down:

```sh
docker pull ghcr.io/tkottke90/daily-report-api:0.0.1
```

The application does not take any environment variables:

```sh
# Environment
``

The application uses a internal JSON database to manage the templates and reports.  To persist the data, connect to the `/var/daily-report` directory;

```yaml
# docker-compose.yaml volume mound
  volume:
    - ./data/:/var/daily-report/

# docker-compose.yaml volume connection
services
  dailyReport:
    image: ghcr.io/tkottke90/daily-report-api
    volume:
      - daily-report-data:/var/daily-report

volumes
  daily-report-data:
```