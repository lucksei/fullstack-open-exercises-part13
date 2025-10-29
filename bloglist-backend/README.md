# Bloglist Backend

This is the backend for the bloglist app for the Part 13 of the Full Stack Open course. Using PostgreSQL and sequelize.

## Getting started

1. Create a .env file with the following variables:

```
PORT=3001
DATABASE_URL=postgres://bloglist:<password>@<host>:<port>/bloglist
SECRET=secretword
```

2. (Optional) Execute the docker-compose.yml file in the root directory to start the database as a container.

```sh
docker compose up --build -d
```

## Usage

Run `npm run dev` to start the server.
