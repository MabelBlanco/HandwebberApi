# USER ROUTES

## GET method

To get a list of users:

```
<protocol>://<host>:<port>/api/users
```

Response example:

```json
{
"results": [
{
"_id": "63eb69878649b3deb9bffd06",
"username": "manolito",
"mail": "manolo@manolo.com",
"password": "$2b$07$aJm4e1SrdIBXqD23gyC7nOKnuMelithIFDwTmeyC9ePGt.woTS7cS",
"image": "foto",
"subscriptions": [
"manolito"
],
"update": "2023-02-14T11:05:51.115Z",
"creation": "2023-02-14T10:59:19.207Z",
"__v": 0
},
{
"_id": "63ebd840e695763e1e38a72f",
"username": "manolitooooo",
"mail": "prueva@manolo.com",
"password": "$2b$07$g/ohDsIKxou9anjvtg7MWudbGrvIatntIVvwBdtfhafFD4QRUDgG6",
"image": "foto",
"subscriptions": [
"manoloioi"
],
"update": "2023-02-14T19:22:05.706Z",
"creation": "2023-02-14T18:51:44.385Z",
"__v": 0
}
]
}
```

You can also filter to obtain a specific user:

Filter by ID:

```
<protocol>://<host>:<port>/api/users/<user_id>
```

Response example:

```json
{
	"result": {
		"_id": "63fbb3d783e9ac81f5255810",
		"username": "test",
		"mail": "test@test.com",
		"password": "$2b$07$7.JqYZpvZZK9Jf6tbzz8hOt6EssHfdqpVud8QYAsz5wH3COgFZ0se",
		"image": "",
		"subscriptions": [],
		"creation": "2023-02-26T19:32:39.222Z",
		"update": "2023-02-26T19:32:39.222Z",
		"__v": 0
	}
}
```

Filter by username:

```
<protocol>://<host>:<port>/api/users/user/<username>
```

Response example:

```json
{
	"result": {
		"_id": "63fbb3d783e9ac81f5255810",
		"username": "test",
		"mail": "test@test.com",
		"password": "$2b$07$7.JqYZpvZZK9Jf6tbzz8hOt6EssHfdqpVud8QYAsz5wH3COgFZ0se",
		"image": "",
		"subscriptions": [],
		"creation": "2023-02-26T19:32:39.222Z",
		"update": "2023-02-26T19:32:39.222Z",
		"__v": 0
	}
}
```

Or:

```
<protocol>://<host>:<port>/api/users/?username=<username>
```

Response example:

```json
{
	"results": [
		{
			"_id": "63fbb3d783e9ac81f5255810",
			"username": "test",
			"mail": "test@test.com",
			"password": "$2b$07$7.JqYZpvZZK9Jf6tbzz8hOt6EssHfdqpVud8QYAsz5wH3COgFZ0se",
			"image": "",
			"subscriptions": [],
			"creation": "2023-02-26T19:32:39.222Z",
			"update": "2023-02-26T19:32:39.222Z",
			"__v": 0
		}
	]
}
```

Filter by mail:

```
<protocol>://<host>:<port>/api/users/?mail=<mail>
```

Response example:

```json
{
	"results": [
		{
			"_id": "63fbb3d783e9ac81f5255810",
			"username": "test",
			"mail": "test@test.com",
			"password": "$2b$07$7.JqYZpvZZK9Jf6tbzz8hOt6EssHfdqpVud8QYAsz5wH3COgFZ0se",
			"image": "",
			"subscriptions": [],
			"creation": "2023-02-26T19:32:39.222Z",
			"update": "2023-02-26T19:32:39.222Z",
			"__v": 0
		}
	]
}
```

## POST method

To register a new user in the database:

```
<protocol>://<host>:<port>/api/users/signup
```

You must attach in the request the body in format "**Form Data**" with the keys and values ​​of the following example:

```json
{
    username: <username> *required,
    mail: <mail> *required,
    password: <password> *required (min length 8 characters) ,
    image: *optional
}
```

Response example:

```json
{
	"result": {
		"username": "Jhonny",
		"mail": "Jhonny@Jhonny.com",
		"password": "$2b$07$HkTk4EyDz.bJJO7CWWT/0OxMk0TrYhGs3hvB/N99N4.AVSBZt65U2",
		"image": "picture",
		"subscriptions": [],
		"update": "2023-02-14T20:01:28.627Z",
		"_id": "63ebe898481fb1cf193717af",
		"creation": "2023-02-14T20:01:28.631Z",
		"__v": 0
	}
}
```

## PUT method

For user update:

```
<protocol>://<host>:<port>/api/users/<user_id>
```

You must attach in the request the body in format "**Form Data**" with the keys and values ​​to update:

Example for update username:

```json
{
    username: <new username>
}
```

Response example:

```json
{
	"result": {
		"_id": "63ebd840e695763e1e38a72f",
		"username": "Jossid",
		"mail": "prueva@manolo.com",
		"password": "$2b$07$g/ohDsIKxou9anjvtg7MWudbGrvIatntIVvwBdtfhafFD4QRUDgG6",
		"image": "foto",
		"subscriptions": [
			"manoloioi"
		],
		"update": "2023-02-14T20:13:39.856Z",
		"creation": "2023-02-14T18:51:44.385Z",
		"__v": 0
	}
}
```

## DELETE method

For delete user:

```
<protocol>://<host>:<port>/api/users/<user_id>
```

Response example:

```json
{
	"result": {
		"acknowledged": true,
		"deletedCount": 1,
		"username": "Jossid",
		"_id": "63ebd840e695763e1e38a72f",
		"mail": "prueva@manolo.com"
	}
}
```