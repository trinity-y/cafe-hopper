# db-project

This is a simple database application that connects to a database and seeds it with initial data for users and cafes.

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
   git clone https://github.com/microsoft/vscode-remote-try-dab.git
   cd db-project
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the src/db and add the necessary 
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
   node db/seed.js
   ```

2. The application will create sample users and cafes in the database.

## License

This project is licensed under the MIT License.