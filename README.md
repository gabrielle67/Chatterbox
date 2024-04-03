
# Chatterbox 

A simple Full Stack Chatting App using Websocket for real time communication and MongoDB to handle authentication and message retrieval.

## Tech Stack

**Client:** ReactJS

**Server:** NodeJS, ExpressJS

**Storage:** MongoDB




## Run Locally

Clone the project

Go to the project directory

```bash
  cd Chatterbox
```

Install server dependencies

```bash
  cd api
  npm install
```

Start the server

```bash
  node index.js
```

Install client dependencies

```bash
  cd ..
  cd chatterbox
  npm install
```

Start the server

```bash
  npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file within the server folder

`MONGO_URL`

`JWT_SECRET`

`CLIENT_URL`

## API Reference

| Endpoint          | Method | Description                                 | Request Body                           | Response                    |
|-------------------|--------|---------------------------------------------|----------------------------------------|-----------------------------|
| `/health`         | GET    | Checks if the server is running properly.   | N/A                                    | `'ok'`                      |
| `/messages/:userId` | GET  | Retrieves all previous messages between the current user and another user. | `userId`: ID of the other user | Array of message objects |
| `/profile`        | GET    | Retrieves the user profile based on the provided token in the request cookies. | N/A                                    | User profile data / `'no token'` |
| `/users`          | GET    | Retrieves a list of all users registered in the system. | N/A                                    | Array of user objects      |
| `/login`          | POST   | Logs in a user by verifying the provided credentials (username and password). | `{ username, password }`              | User ID / Error status     |
| `/logout`         | POST   | Logs out the current user by removing the token cookie. | N/A                                    | `'ok'`                      |
| `/signup`         | POST   | Registers a new user with the provided username and password. | `{ username, password }`              | User ID / Error status     |
