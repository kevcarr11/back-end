# Restaurant Pass Backend
---

* [Endpoints](#endpoints)

## Deployed Server

The server is deployed to heroku at the url [https:\/\/mhagner-rest-pass.herokuapp.com/](https://mhagner-rest-pass.herokuapp.com/).

## Endpoints

### POST `/api/auth/register`

Expects an object with the following keys with the following constraints:

| Field | Type | Other Constraints |
| ---- | --- | --- |
| `firstName` | string | N/A |
| `lastName` | string | N/A |
| `city` | integer | Must reference the id of a city |
| `email` | string | Must conform to a valid email. Must be unique to a single account |
| `password` | string | Must be 8 characters or longer, but less than 40. |

Possible Status Codes
* 201 - Successfully created user
* 400 - Bad request (There will be a message field in the return type with more
    information about the error)
* 500 - Internal server error (You shouldn't be getting these. If you are, let
    me know because something isn't working as expected)

On success the endpoint will return an object with a `token`, and `user` inside. The token
should be saved to local storage, and sent with all further requests in the
request header as an `authorization`.

The user will match the following shape

| Key | Value type |
| --- | --- |
| `firstName` | string |
| `lastName` | string |

Example

```js

fetch('https://mhagner-rest-pass.herokuapp.com/api/auth/register', {
  method: 'POST',
  body: JSON.stringify({
    firstName: 'Matt',
    lastName: 'Hagner',
    email: 'matthagner@example.com',
    password: 'anunsafepassword',
    city: 1, // Right now we will only have one city in the database
    // so the city id of 1 is the only valid input for city
  })
})
  .then(res => res.json())
  .then(data => {
    localStorage.setItem('token', JSON.stringify(data.token));

    // This is where you could redirect the user on a succesful login
    // ...
  })
  .catch(err => {
    // This is where you would handle any errors
  });

```

### POST `/api/auth/login`

Expects an object with the following keys with the following constraints:

| Field | Type | Other Constraints |
| ---- | --- | --- |
| `email` | string | Must conform to a valid email |
| `password` | string | N/A |

Possible Status Codes
* 201 - Successfully logged in
* 400 - Bad request (There will be a message field in the return type with more
    information about the error)
* 401 - Unauthorized (The username or password are incorrect)
* 500 - Internal server error (You shouldn't be getting these. If you are, let
    me know because something isn't working as expected)

On success you a `token` and a `user` object will be returned. 

The user will match the following shape.

| Key | Value type |
| --- | --- |
| `firstName` | string |
| `lastName` | string |

```js

// This example shows a what a successful login would look like
// assuming that a user with an email `matthagner@example.com` exists
// and their password is `anunsafepassword`.
fetch('https://mhagner-rest-pass.herokuapp.com/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({
    email: 'matthagner@example.com',
    password: 'anunsafepassword',
  })
})
  .then(res => res.json())
  .then(data => {
    localStorage.setItem('token', JSON.stringify(data.token));

    // This is where you could redirect the user on a succesful login
    // ...
  })
  .catch(err => {
    // This is where you would handle any errors
  });

```

### GET `/api/users/restaurants`

Possible Status Codes
* 200 - Successfully and returns a list of restaurants 
* 401 - Unauthorized (invalid token or not logged in)
* 500 - Internal server error (You shouldn't be getting these. If you are, let
    me know because something isn't working as expected)

On success an array of restaurants will be returned 

```js
fetch('https://mhagner-rest-pass.herokuapp.com/api/users/restaurants', {
  headers: {
    Authorization: token, // (this token could come from localStorage)
  }
})
  .then(res => res.json())
  .then(restaurants => {
      // Use restaurants however you want or need
  })
  .catch(err => {
    // This is where you would handle any errors
  });

```

### GET `/api/users/visits`

Possible Status Codes
* 200 - Successfully and returns a list of restaurants 
* 401 - Unauthorized (invalid token or not logged in)
* 500 - Internal server error (You shouldn't be getting these. If you are, let
    me know because something isn't working as expected)

On success an array of restaurants the user has visited

```js
fetch('https://mhagner-rest-pass.herokuapp.com/api/users/visits', {
  headers: {
    Authorization: token, // (this token could come from localStorage)
  }
})
  .then(res => res.json())
  .then(visits => {
      // Use visits however you want or need
  })
  .catch(err => {
    // This is where you would handle any errors
  });
```

### POST `/api/users/visit/:restaurantId`

Possible Status Codes
* 200 - Successful 
* 401 - Unauthorized (invalid token or not logged in)
* 500 - Internal server error (You shouldn't be getting these. If you are, let
    me know because something isn't working as expected)

On success an array of restaurants the user has visited

```js
fetch('https://mhagner-rest-pass.herokuapp.com/api/users/visit/1', {
  headers: {
    Authorization: token, // (this token could come from localStorage)
  }
})
  .then(res => res.json())
  .then(wasSuccessful => {
      // Use restaurants however you want or need
  })
  .catch(err => {
    // This is where you would handle any errors
  });
```
### DELETE `/api/users/visit/:restaurantId`

Possible Status Codes
* 200 - Successful 
* 401 - Unauthorized (invalid token or not logged in)
* 500 - Internal server error (You shouldn't be getting these. If you are, let
    me know because something isn't working as expected)

On success an array of restaurants the user has visited

```js
fetch('https://mhagner-rest-pass.herokuapp.com/api/users/visit/1', {
  method: "DELETE",
  headers: {
    Authorization: token, // (this token could come from localStorage)
  }
})
  .then(res => res.json())
  .then(wasSuccessful => {
      // Use restaurants however you want or need
  })
  .catch(err => {
    // This is where you would handle any errors
  });
```

