To get a JWT, you must to signup with your email and Password.

Enter both as follows:

In the route

```
<protocol>://<host>:<port>/api/users/login
```

You must attach in the request the body in format "**Form URL Encoded**" with the keys and values ​​of the following example:

```json
{
  "mail": "<yourmail>",
  "password": "<yourpassword>"
}
```

Correct response example:

```json
{
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2VmN2FiMGNiZmNiMTBlMzIyYzZjNjYiLCJpYXQiOjE2NzY2Mzk1ODQsImV4cCI6MTY3NjcyNTk4NH0.w1UtDObpF9JAuUT-xNyNtB40yRz0JGmQHMtQHUn4XzE"
}
```

Wrong response example:

```json
{
  "status": 401,
  "message": "Wrong password"
}
```
