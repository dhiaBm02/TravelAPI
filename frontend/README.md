# Trip and Destination API

## Introduction
This API provides a system to manage trips and their destinations. A trip is a container for planned destinations and include fields such as time period, name, description, participants, and more. A destination is a place to be visited during a trip and include fields such as name, description, time period, activities, participants, photos, and more.

## Features
- Create, read, update, and delete trips and destinations.
- Add and remove one or multiple destinations to/from a trip.
- Retrieve all trips that include a specific destination.
- Retrieve all destinations that include a specific trip
- Search trips by name or date.
- Search destinations by name.

## API Endpoints

### Trips
- **GET /trips**: Retrieve all trips.
- **GET /trips/:id**: Retrieve a specific trip by ID.
- **POST /trips**: Create a new trip.
- **PUT /trips/:id**: Update a specific trip by ID.
- **DELETE /trips/:id**: Delete a specific trip by ID.

### Destinations
- **GET /destinations**: Retrieve all destinations.
- **GET /destinations/:id**: Retrieve a specific destination by ID.
- **POST /destinations**: Create a new destination.
- **PUT /destinations/:id**: Update a specific destination by ID.
- **DELETE /destinations/:id**: Delete a specific destination by ID.

### Trip-Destination Management
- **GET /trips/:id/destinations**: Retrieve all destinations of a specific trip by ID.
- **POST /trips/:tripId/destinations**: Add one or more destinations to a trip.
- **DELETE /trips/:tripId/destinations**: Remove one or more destinations from a trip.
- **GET /destinations/:id/trips**: Retrieve all trips of a specific destination by ID.

### Search
- **GET /trips**: Search for trips by name or date. Accepts query parameters `name` and `date`.
- **GET /trips**: Search for destinations by name. Accepts query parameter `name`.

### Freestyle Task 1: Download Trip as Calendar File

#### Description
This endpoint allows users to download a trip as an `.ics` calendar file, which can be added to their calendar applications.

#### Request
- **GET /trips/:id/calendar**: Download a specific trip by ID as an .ics calendar file.

#### Response
HTTP/1.1 200 OK
Content-Type: text/calendar
Content-Disposition: attachment; filename="trip-{id}.ics"

BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:adamgibbons/ics
METHOD:PUBLISH
X-PUBLISHED-TTL:PT1H
BEGIN:VEVENT
UID:0HUerOGKKn1rJqFHwil4N
SUMMARY:Trip 1
DTSTAMP:20240530T085718Z
DTSTART:20240423T220000Z
DTEND:20240427T220000Z
DESCRIPTION:test calendar feature
LOCATION:Trip 1
END:VEVENT
END:VCALENDAR

### Freestyle Task 2: Retrieve more country and Weather informations form 2 externals APIs 

#### Description
This feature allows users to retrieve detailed information about a destination, including country information from the CSC API and weather information from the OpenWeather API.

#### Request
- **GET /destinations/:id**: Retrieve a specific destination by ID. note: works only with real cities names like Darmstadt, Paris, Tunis..

#### Response
HTTP/1.1 200 OK
Content-Type: text/calendar

{
    "createdAt": "2024-05-24T13:40:32.357Z",
    "updatedAt": "2024-05-28T15:56:40.204Z",
    "name": "berlin",
    "description": "test",
    "activities": "test",
    "photos": null,
    "startDate": "2024-05-24T13:40:17.010Z",
    "endDate": "2024-05-24T13:40:17.010Z",
    "id": "257242f2-ae7c-4b47-81ee-70980fba2581",
    "trips": [
        ...
    ],
    "country": {
        "id": 82,
        "name": "Germany",
        "iso3": "DEU",
        "numeric_code": "276",
        "iso2": "DE",
        "phonecode": "49",
        "capital": "Berlin",
        "currency": "EUR",
        "currency_name": "Euro",
        "currency_symbol": "€",
        "tld": ".de",
        "native": "Deutschland",
        "region": "Europe",
        "region_id": 4,
        "subregion": "Western Europe",
        "subregion_id": 17,
        "nationality": "German",
        "timezones": "[{\"zoneName\":\"Europe/Berlin\",\"gmtOffset\":3600,\"gmtOffsetName\":\"UTC+01:00\",\"abbreviation\":\"CET\",\"tzName\":\"Central European Time\"},{\"zoneName\":\"Europe/Busingen\",\"gmtOffset\":3600,\"gmtOffsetName\":\"UTC+01:00\",\"abbreviation\":\"CET\",\"tzName\":\"Central European Time\"}]",
        "translations": "{\"kr\":\"독일\",\"pt-BR\":\"Alemanha\",\"pt\":\"Alemanha\",\"nl\":\"Duitsland\",\"hr\":\"Njemačka\",\"fa\":\"آلمان\",\"de\":\"Deutschland\",\"es\":\"Alemania\",\"fr\":\"Allemagne\",\"ja\":\"ドイツ\",\"it\":\"Germania\",\"cn\":\"德国\",\"tr\":\"Almanya\"}",
        "latitude": "51.00000000",
        "longitude": "9.00000000",
        "emoji": "🇩🇪",
        "emojiU": "U+1F1E9 U+1F1EA"
    },
    "weather": {
        "coord": {
            "lon": 13.4105,
            "lat": 52.5244
        },
        "weather": [
            {
                "id": 500,
                "main": "Rain",
                "description": "light rain",
                "icon": "10d"
            }
        ],
        "base": "stations",
        "main": {
            "temp": 18.9,
            "feels_like": 18.88,
            "temp_min": 16.72,
            "temp_max": 21.1,
            "pressure": 994,
            "humidity": 78
        },
        "visibility": 10000,
        "wind": {
            "speed": 2.68,
            "deg": 200
        },
        "rain": {
            "1h": 0.15
        },
        "clouds": {
            "all": 20
        },
        "dt": 1717059832,
        "sys": {
            "type": 2,
            "id": 2011538,
            "country": "DE",
            "sunrise": 1717037470,
            "sunset": 1717096624
        },
        "timezone": 7200,
        "id": 2950159,
        "name": "Berlin",
        "cod": 200
    }
}




## Setup Instructions

### Prerequisites
- Node.js
- npm
- PostgreSQL

### Installation
1. Clone the repository:
    ```bash
    git clone https://code.fbi.h-da.de/stdhbenme/fwe-ss-24-1116625.git
    cd fwe-ss-24-1116625
    cd backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a new database schema
    - First, connect to your PostgreSQL database using the `psql` command-line or a GUI like `pgAdmin`.
    
    - Once connected to the PostgreSQL database, create a new schema.

    - Open your `.env` file and add or update your database connection details.

4. Configure environment variables:
    Create a `.env` file in the backend directory with the following content:
    ```env
    PORT=3000
    CSC_API_KEY = 'RjlSdmk2d1NHWnNHZlk3dHJrVEo1ZWtubUtBbzhxMzZ0R05zTU1HcA=='
    OW_API_KEY = '009f8f00a19d5951a35d1dd3e84ff5fb'
    environment = 'dev'
    DB_NAME = 'postgres'
    DB_USER = 'postgres'
    DB_PASSWORD = 'your_pwd'
    DB_SCHEMA = 'your_schema_name'
    ```

5. create the database schema
    ```bash
    npm run schema:fresh
    ```

6. Start the server:
    ```bash
    npm start
    ```

The API will be available at `http://localhost:3000`.

## API Usage

For more understanding how the API works and what it is needed for every request you can render the [openapispec.yml](api-fwe-ss24.yml) file in a [swagger editor tool](https://swagger.io/tools/swagger-editor/).


## Testing

### Automated Tests
1. Adjust the environment variables for the test environment:
    Update the `.env` file in the backend directory with the following content:
    ```env
    PORT=3000
    CSC_API_KEY = 'RjlSdmk2d1NHWnNHZlk3dHJrVEo1ZWtubUtBbzhxMzZ0R05zTU1HcA=='
    OW_API_KEY = '009f8f00a19d5951a35d1dd3e84ff5fb'
    environment = 'test'
    DB_NAME = 'postgres'
    DB_USER = 'postgres'
    DB_PASSWORD = 'your_pwd'
    DB_SCHEMA = 'your_schema_name'
    ```

2. To run automated tests, use the following command:
    ```bash
    cd backend
    npm test
    ```

## Frontend

for more understanding i made a demo video that could help you understand how to interact with the web interface.
Here's a quick demo of how it works:

[![Demo](frontend/public/assets/HomePage.png)](https://www.youtube.com/watch?v=OW0K5M8eScw)

- List view and Detail view for trips.
- List view and Detail view for destinations.
- Create, update, and delete trips.
- Create, update, and delete destinations.
- Search trips by name or date.
- View all trips for a specific destination.

### Frontend Structure

- **Components**
  - TripListView: Displays a list of trips.
  - TripDetaislView: Displays details of a single trip.
  - DestinationListView: Displays a list of destinations.
  - DestinationDetailsView: Displays details (+ country and weather infos) of a single destination.
  - TripForm / Edit-Delete Icon: Form for creating and editing trips.
  - DestinationForm / Edit-Delete Icon: Form for creating and editing destinations.
  - Calendar Icon: Download .ics file for a specific destination and add it to the user's Calendar.

- **Routes / Links**
  - `/`: HomePage.
  - `/trips`: TripsListView.
  - `/trips/:id`: TripDetailsView.
  - `/destinations`: DestinationsListView.
  - `/destinations/:id`: DestinationDetailsView.


### Installation

make sure that the backend runs and the `environment` in the `.env` file is not `test`, then do the following steps:

7. go to the frontend repository:
    ```bash
    cd fwe-ss-24-1116625
    cd frontend
    ```

8. Install dependencies:
    ```bash
    npm install
    ```

9. Start the server:
    ```bash
    npm start
    ```
The HomePage will be available at `http://localhost:5173`.
    

## Conclusion

This API provides comprehensive functionalities to manage trips and their destinations. The documentation covers all necessary details to set up, use, and test the API effectively. For further questions, please refer to the source code or contact me.


This README file provides a thorough overview of the API's capabilities, setup instructions, and usage examples. It ensures that anyone interested in using or testing the API can easily understand and interact with it.
