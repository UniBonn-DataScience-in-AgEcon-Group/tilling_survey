# Tilling Survey for ILR

## Running locally

Install locally by executing

```
npm install
```

then run with

```
npm run dev
```

## Publish to GitHub Pages

To publish the site to GitHub Pages, you need to do the following:

1. Ensure you have a .env file containing both a Mapbox API key and the database name. The syntax is:

VITE_MAPBOX_API_KEY=ENTER_MAPBOX_KEY_HERE
VITE_DB_NAME=ENTER_DB_LINK_HERE

The site will not run without these.

2. Execute the following command:

```
npm run deploy
```

The site will then be uploaded to https://UniBonn-DataScience-in-AgEcon-Group.github.io/tilling_survey

Changes can take a few moments to come into effect.

## Changing questions/text

There are currently two places where questions can be specified.

1. Questions which will be shown together with the fields selected are contained in "MapboxSurvey.jsx", specifically, the "generateMarkQuestions" function. To add more questions, simply follow the syntax of the sample questions, using questions.push.

2. Questions asked after the Map-related section is done are stored in questions.js. Again, you can add new questions by simply following the syntax of the sample questions already provided. Creating a new array will automatically create a new page on the website.

The map-related section currently only handles text input fields, whereas the other section can also show radio buttons with multiple options. To allow for other types (dropdown etc.), you can update the "renderQuestions" function in the corresponding .jsx file (MapboxSurvey.jsx/Survey.jsx)