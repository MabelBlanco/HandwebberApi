# handwebber-api

Backend-Api para handwebber

## Dependencies

This app require mongoDB to run.  
Be sure to have an authorized database mongo connexion URI, to create, modify and delete collectios and models in that database.

## Installation

Clone the `https://github.com/handwebber/handwebber-api.git` repository.  
Enter in `/handwebber`.  
Exec `npm install` to install dependencies.  
Create an `.env` file. You have an configuration example in `.env.example`.

- You have to indicate the conexion string to mongodb.
- You have to indicate the private JWT key.
- Default port for the application is 3000. If you want to change it, it's necessary to indicate the PORT environment variable, with the port to use. For example: `PORT=8000`.  
  Run `npm run init`.

## DEVELOPER MODE

(with debug and nodemon)

```
npm run dev
```

## PRODUCTION MODE

```
npm start
```

## CALLING ADVERTISEMENTS LIST

Make a request with the next configuration:

```bash
http://localhost:port/api/advertisement
```

This will return the complete list of advertisements.  
You can call the `skip` and `limit` query params to make pagination:  
`.../api/advertisement?skip=10&limit=10` --> this will skip the first ten ads and only will return ten ads more

Also you can apply filters in the query params:

- `name=string` --> it will return the ads which contains the string provided in their name
- `tag=string` --> it will return the ads which contains the string provided in their tags
- `price=...` --> it will return the ads selon the range indicated. The range works:

  - **one number** --> it will return the ads with exact price
  - **two numbers, separates by '-' without spaces** --> it will return the ads between the prices indicated
  - **one number before '-' without spaces** --> it will return the ads with price greater or equal to the price indicated
  - **one number after '-' without spaces** --> it will return the ads lower or equal to the price indicated

  Example:  
  `.../api/advertisement?name=bici&tag=mobility&price=-200`

You can sort the response list, using the `sort` query param, providing the field to sort:  
`.../api/advertisement?sort=price`  
Introducing '-' before the field name, will sort in reverse mode.
