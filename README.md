# YelpGolf

YelpGolf is a social site used to view golf courses around the world. Users can create and review golf courses, as long as they are logged in.

## Demo

<a href="https://salty-spire-23187.herokuapp.com/">YelpGolf</a>

<img src="/Users/mmtakeuchi/Pictures/yelpgolf-home.png">
<img src="/Users/mmtakeuchi/Pictures/yelpgolf-courses.png">
<img src="/Users/mmtakeuchi/Pictures/yelpgolf-show.png">

## Installation

```
git clone https://github.com/himanshup/yelpcamp.git
cd yelpcamp
npm install or yarn install
```

Create a Cloudinary account at <a href="https://cloudinary.com/documentation">Cloudinary</a>. And get your API key and secret key. There will be used to upload and store photos.

```
Create a .env file to store your keys.
CLOUDINARY_CLOUD_NAME=CLOUDINARY_NAME
CLOUDINARY_KEY=API_KEY
CLOUDINARY_SECRET=SECRET_CODE
Replace the values with your own account keys.
```

Next create a Mapbox account at <a href="https://docs.mapbox.com/api/overview/">Mapbox</a> to get another API key. This will be used to display and interactive with a map feature.

```
Add your mapbox key to the .env file
MAPBOX_TOKEN=API_KEY
```

## Running

```
npm start or yarn start
```
