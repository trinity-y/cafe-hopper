# Frog Cafe Hopper

How to run our project

1. Clone the repo on your local device

``` git clone https://github.com/trinity-y/cafe-hopper ```

2. Set up environment variables

There are two .env files required for this project to function. 

The first is in the root ./cafe-hopper of this project. It needs to be in this format:

```
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DATABASE_URL=
```

In the ./cafe-hopper/react-frontend, you must use the following .env file format:

```
REACT_APP_LOCAL_API_URL=http://localhost:3001
REACT_APP_PROD_API_URL=
REACT_APP_LOCAL_FRONTEND_URL=http://localhost:3000
REACT_APP_PROD_FRONTEND_URL=
REACT_APP_ISLOCAL=true

# firebaseConfig
REACT_APP_FIREBASE_WEB_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_DEFAULT_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```
3. Docker Compose

``` docker compose up  -d --build```

4. Navigate to relevant pages

You can navigate to both frontend and backend pages using different ports.

Frontend port: http://localhost:3000/

Frontend pages:

http://localhost:3000/signup
http://localhost:3000/login
http://localhost:3000/complete-signup
http://localhost:3000/cafesearch

Backend port: http://localhost:3001/

You can view all completed routes in ```typescript-backend/src/routes```
