# Northcoders News API

NC_News is an API that retrieves
data about dummy articles, topics, comments and users.
The database used to store this information is PostgreSQL hosted on Supabase (edit: previously it was hosted on ElephantSQL which has been discountinued).

The endpoints.json file shows all available API endpoints. Alternatively, on the hosted version, "/api" endpoint will list all the available endpoints and their desciptions.

The API is hosted and deployed on Render.

You can find it at https://nc-news-z5u7.onrender.com/api

#### Running this project locally.

In order to access this project locally, you will need to have minimum versions of Node.js(v20.10.0) and Postgres (14.9) installed on your machine.
<br>

#### Steps

1.Clone or fork this repo

2.Run npm install command in the terminal to install all necessary dependencies
from package.json

3.Create two .env files in the root of the project directory that and set environment variables inside of them.

    .env.test
    PGDATABASE=nc_news_test
    (test database)

    .env.development
    PGDATABASE=nc_news
    (development database)

(You can check the .env-example file to help you)

4.Use npm run setup-dbs script to set-up the databases.

5.Use npm run seed script to seed the development database

6.To run tests, use npm test (test database will be seeded automatically before each test runs)
