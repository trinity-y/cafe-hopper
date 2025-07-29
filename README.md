# CaféHopper 🐸☕️

**How to run our project:**

1. Clone the repo on your local device

``` git clone https://github.com/trinity-y/cafe-hopper ```

2. Set up environment variables

There are two .env files required for this project to function. 

The first is under the backend folder "typescript-backend" of this project. It needs to be in this format:

```
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DATABASE_URL=
GOOGLE_MAPS_API_KEY=
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

You may need to switch between branches in order to access these pages.

🥐 Frontend port: http://localhost:3000/

⭐️ Frontend pages:

http://localhost:3000/signup

http://localhost:3000/login

http://localhost:3000/complete-signup

http://localhost:3000/cafesearch

http://localhost:3000/profile

http://localhost:3000/feed

http://localhost:3000/blend

🥐 Backend port: http://localhost:3001/

You can view all completed routes in ```typescript-backend/src/routes```

# Fully implemented features

1. Users
3. Basic cafe search
4. Filtered cafe search (price & topcafes)
5. Bookmarks
6. Reviews
7. Friend requests
8. Feed
9. Blend

# How to generate the “production” dataset and load it into our database
Since our dataset is only ~300 entries, we have saved it in typescript-backend/prod_data/cafes.json

However, you may also generate it using the script in typescript-backend/scripts/getCafeData.js
This would require the following steps:
1. Add google maps API key to .env (this will require Google Cloud Project)
2. Run writeCafeData()
