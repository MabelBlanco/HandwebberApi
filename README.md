# handwebber-api

Backend-Api para handwebber

## Installation

Clone the `https://github.com/handwebber/handwebber-api.git` repository.  
Enter in `/handwebber`.  
Exec `npm install` to install dependencies.  
Create an `.env` file. You have an configuration example in `.env.example`.

- At least you have to indicate the conexion string to mongodb.
- Default port for the application is 3000. If you want to change it, it's necessary to indicate the PORT environment variable, with the port to use. For example: `PORT=8000`.

## DEVELOPER MODE

(with debug and nodemon)

First, create a `.env` file in `/handwebber`, which must contain, at least, the

```
npm run dev
```

## PRODUCTION MODE

```
npm start
```
