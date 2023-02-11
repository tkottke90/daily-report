# Daily Report API

NodeJS API for creating reports from scripts.  I was playing around with the [N8N Project]() and wanted to come up with a way to generate and store reports from those automation tasks and view them at a later date.  This API will serve as the aggregation and HTML report generator.

If you want to use this project for yourself please see the [Security](#security) section first!  There is no inherent security currently built into this project!

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

## Security

Thanks for checking out the security section.  So what I want to tell you here is that I designed this project to work on my own internal VPN with controlled access.  No one was able to access it except for my personally registered devices.  It is never exposed to the public internet.

I really want you to know that so that you can make the best choices for yourself AND you wanted it publicly available I would recommend putting it behind some security.  Something as simple as the authentication configuration on an NGINX server should work well.

I am not responsible for any lost or stolen data.  Thanks for your interest in my project!