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
- You have to indicate the maximun image size files in megabytes: `MAX_FILES_SIZE_MB=5` (5 MB maximun). 5MB is the default value if this variable is not set.
- You have to indicate the service mail. Example: `EMAIL_SERVICE_FROM=info@handwebber.com`
- You have to indicate the RabbitMQ url. Example: `RABBITMQ_URL=your://rabbitmqlurl`
- Default port for the application is 3000. If you want to change it, it's necessary to indicate the PORT environment variable, with the port to use. For example: `PORT=8000`.
- [Configure the e-mails sender](#emailSender) (look down in this instructions). The app can run without sending emails.

  Run `npm run init`.

## DEVELOPER MODE

(with debug and nodemon)
Run:

```
npm run dev
```

## PRODUCTION MODE

Run:

```
npm start
```

# API DOCS

One the API is working, you can access to Swagger-Handwebber-Api-Docs, introducing the url `http://yourbaseurl/api-docs`.  
If you are using the production API in 54.84.80.202, you must indicate [http://54.84.80.202/api-docs](http://54.84.80.202/api-docs)

# DEVELOPPER NOTES

## SEND EMAILS

<a name="emailSender"></a>

### Configuring emails sender in your server.

- Go to folder "consumer".
- `npm i`
- Configure the `.env` file:

  - WEB_HOME_URL=`yourhomeurl`
  - You have to indicate the service mail. Example: `EMAIL_SERVICE_FROM=info@handwebber.com`
  - You have to indicate the API Key for your emaile service: Example: `SENDINBLUE_EMAIL_SERVICE_APIKEY=yourAPIKey`
  - You have to indicate the RabbitMQ url. **This URL must be the same that in your app .env configuration**. Example: `RABBITMQ_URL=your://rabbitmqlurl`

  This is a microservice. You must run this module apart.  
  To run this module, you must call `npm run start`.

### Preparing a module to send mails with email sender.

We have a worker called "consumer". He only send emails and notification, like a microservice.

After, we must to publisher a message with the properties that we will need for send the email.

Steps:

1- Import the publisher

```

const publisher = require("../../lib/rabbitmq/publisher");

```

2- Create an object with properties that you will need.
Property **function** indicates if we want to send an email (sendEmail) or send a notification (sendNotification).
Property **email** indicates what email you want to send.

```

      const messageConfig = {
        function: "sendEmail",
        email: "welcomeEmail",
        user: userResult,
      };

```

3- At last, send the object with publisher.

```

publisher(messageConfig);

```

# Working with API

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
- `idUser=string` --> it will return the ads which contains the idUser provided
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

### Create new email

For create a new email:

1- Go to folder "consumer".
2- Create a function that returns an html or template. In the function, put as parameters the variables that you will need in the email. Save this at "emails".
3- Open "consumer.js" and import the email

```

const welcomeEmail = require("./emails/Welcome");

```

4- At consumer function, add the new email. The properties will come to you in an object called payload.
5- Use the function **sendEmail**. The first parameter is the recipient (to), the second the subject and the third the body of the email (the function that we have previously created as email).

````
sendEmail(
            user.mail,
            "Welcome to Handwebber",
            welcomeEmail(user.username)
          );
```recoverPasswordEmail
````
