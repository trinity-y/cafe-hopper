# Cafe Hopper

Just to get started, we just connect to a database and seeds it with initial data for users and cafes for now.

## Project Structure

```
db-project
├── src
│   ├── db
│   │   └── seed.js            # Database seeding script
│   │   └── .env            
├── package-lock.json                # NPM configuration file
├── package.json                # NPM configuration file
└── README.md                   # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/trinity-y/cafe-hopper.git
   cd cafe-hopper
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Ensure you have postgres downloaded and set up locally (latest version should be fine)  

    Go here for the installation instructions: https://www.postgresql.org/download/macosx/

5. Create a `.env` file in the src/db and add the necessary 
   configs to connect to the local database you have created
   ```
   POSTGRES_DATABASE=
   POSTGRES_USER=
   POSTGRES_PASSWORD=   
   POSTGRES_HOST=
   POSTGRES_PORT=
   ```

## Usage

1. Connect to the database and seed it with initial data by running:
   ```
   node seed.js
   ```

2. The script will create sample users and cafes in the database.

3. Query into the database and check whether the seeding was successful.
