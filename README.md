# Quiz Up

Manager for panel based questions games.

## Technologies

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/): Data Storage
- [Express.js](https://expressjs.com/): API service framework
- [React](https://reactjs.org/): Frontend framework
- [Docker](https://www.docker.com/): Provides a way to run applications securely isolated in a container.

## Folder Structure

```bash
quiz-up
├───── app/                          # All public assets
|   |  ├── public/                   # All of the client side code
|   |  ├── src/                      # All of the client side code
|   |   |   ├── config/              # Configuration files
|   |   |   ├── constants/           # Constant files for the forms and components
|   |   |   ├── containers/          # React containers
|   |   |   ├── components/          # React components
|   |   |   └──  helpers/            # Helper functions used in the frontend section of the file
└────── .gitignore                   # files ignored by git
└────── .dockerignore                # files ignored by docker
└────── Dockerfile                   # file that contains the commands needed to assemble an image
└────── package.json                 # All dependencies and script to run the application
├───── server/                       # Source directory
|   |   ├── src/                     # All server side code
|   |   |   ├── config/              # Configuration files
|   |   |   ├── rest/                # "heart" of the API
|   |   |   |   ├── components       # Each component takes care of its own routes, controller and model
|   |   |   |   └── utils            # API's utils
|   |   |   └── services/            # files for external services. E.g: sending mails
|   |   |   └── index.js             # Initialize server and handle routes and services
└───── babel.config,js               # Babel configuration file
└───── .dockerignore                 # files ignored by docker
└───── Dockerfile                    # file that contains the commands needed to assemble an image
└── .docker-compose.yml              # file defining services, networks and volumes for docker containers
└── README.md                        # README file
```

---

# Minimum setup needed to run the project

## Docker

You need to have `docker` and `docker-compose` installed to run this project. If you don't have it installed you can follow [this guide](https://docs.docker.com/install/) for `docker` and [this one](https://docs.docker.com/compose/install/) for `docker-compose`.

- First clone this repository.
- After that open your terminal of preference and navigate to the directory you cloned this project.
- type the command `docker-compose up`

## Scripts used on the project

### Server side

- `npm start`: starts the application
- `npm run build`: Compiles the code from ES6 to ES5.
- `npm run dev`: Starts the application in a development environment
- `npm run lint`: Check the code based on `eslint` rules
- `npm run prettier`: Check the code based on `prettier` rules

### Client side

- `npm start`: run the app in development mode
- `npm run build`: builds the app for production to the build folder
- `npm run test`: Runs the test watcher in an interactive mode.
