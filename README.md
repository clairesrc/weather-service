#weather-service

A simple Docker image for getting weather information for the machine the image is being run on.

## Build
Copy .env.example to .env and fill out the missing API key secrets, then run `docker build -t clairesrc/weather-service .` to build the image.

## Run
Run `docker run --env-file .env -p 8080:8080 -d clairesrc/weather-service` to start the container, then open http://localhost:8080 in a browser.