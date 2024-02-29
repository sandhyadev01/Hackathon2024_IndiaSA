# Vector Movie Search - What's that movie where...

Try out the app here: [https://ireach-dodfh.mongodbstitch.com/](https://ireach-dodfh.mongodbstitch.com/)

![Screenshot](screenshot.png)

## Prerequisites
[Sign up with email and add unique phone number to get free $5 credits on OpenAI](https://openai.com/pricing#:~:text=Start%20for%20free)\
\
You will have to enter your own API key while trying out Vector Search.

## What's Vector Search all about?
Standard Search is based on just stemming, lemmatization and tokenization. This does not produce relevant results as it is based on keywords more or less.\
Vector Search allows you to search with embeddings. Compare the results yourself.\
\
Try out some free-text plots like:
- _a business tycoon is captured in war zone and then gets out of it by using science_
- _alien stuck on earth is saved and sent back by a group of kids_
- _a man who forgets things after some time takes revenge for the killer of his beloved_

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
It will automatically open [http://localhost:3000](http://localhost:3000) in your browser.

The page will reload when you make changes.

## App Service Components
- [Triggers function](/Triggers/functions/Atlas_Triggers_openAI_scheduled_1689945708.js)
- [Vector Search function](/Triggers/functions/vector.js)

## Deploying Changes
`sh deploy.sh`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
