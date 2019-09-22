# Restaurant Pass Backend
---

## Deployed Server

The server is deployed to heroku at the url [https:\/\/mhagner-rest-pass.herokuapp.com/](https://mhagner-rest-pass.herokuapp.com/).

## Endpoints

POST `/api/auth/register`

Expects an object with the following keys with the following constraints:
| Field | Type | Other Constraints |
| ---- | --- | --- |
| `firstName` | string | N/A |
| `lastName` | string | N/A |
| `city` | integer | Must reference the id of a city |
| `email` | string | Must conform to a valid email. Must be unique to a single
account |
| `password` | string | Must be 8 characters or longer, but less than 40. |

Possible Status Codes
* 201 - Successfully created user
* 400 - Bad request
* 500 - Internal server error

On success the endpoint will return an object with a `token` inside. The token
should be saved to local storage, and sent with all further requests in the
request header as an `authorization`.

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
