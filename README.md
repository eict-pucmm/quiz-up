# Quiz Up

Manager for panel based questions games.

## Technologies

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/): Data Storage
- [Express.js](https://expressjs.com/): API service framework
- [React](https://reactjs.org/): Frontend framework
- [Docker](https://www.docker.com/): Provides a way to run applications securely isolated in a container.
- [RabbitMQ](https://www.rabbitmq.com/): Message queue used for communication

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
└────── Dockerfile                   # file that contains the commands needed to assemble an image
└────── package.json                 # All dependencies and script to run the application
├───── server/                       # All server side code
|   |   ├── src/                     # Source directory for the server
|   |   |   ├── config/              # Configuration files
|   |   |   ├── rest/                # "heart" of the API
|   |   |   |   ├── components       # Each component takes care of its own routes, controller and model
|   |   |   |   └── utils            # API's utils
|   |   |   └── services/            # files for external services. E.g: sending mails
|   |   |   └── index.js             # Initialize server and handle routes and services
└─────── babel.config.js             # Babel configuration file
└─────── Dockerfile                  # file that contains the commands needed to assemble an image
└── .docker-compose.yml              # file defining services, networks and volumes for docker containers
└── .gitignore                       # files ignored by git
└── .dockerignore                    # files ignored by docker
└── .nvmrc                           # handles the node version
└── README.md                        # README file
```

---

## Minimum setup needed to run the project

### Node

- Node.js v10: Strongly recommend to use `nvm` to manage different versions of `node` and take advantage of the `.nvmrc` file. [Installation guide](https://github.com/nvm-sh/nvm#installation)

### Docker

You need to have `docker` and `docker-compose` installed to run this project. If you don't have it installed you can follow [this guide](https://docs.docker.com/install/) for `docker` and [this one](https://docs.docker.com/compose/install/) for `docker-compose`.

- First clone this repository.

  - ```bash
    git clone git@github.com:ect-pucmm/quiz-up.git
    ```

- navigate to the directory you cloned the project.
  - ```bash
    cd quiz-up
    ```
- Add the neccessary environment variables for the server in its own `.env` file in `/server/.env` (More info on the [this](https://github.com/ect-pucmm/quiz-up#environment-variables) section)
- When you're in the root directory type the command `npm run install-all` and then:
  - To start the server in a local environment:
    ```bash
    docker-compose up
    ```
  - To start the client admin app:
    ```bash
    npm run react
    ```

### Environment variables

- **PORT**: Port number to run the API
- **MONGO_URI**: URI to connect to the mongo database locally
- **AMQP_CONNECTION_URL**: URL to connect to the MQ service
- **MONGO_DOCKER_URI**: URI to connect to the mongo database in docker
- **NODE_ENV**: Node environment value

### Scripts used on the project

#### General scripts

- `npm run burn`: Stops and removes all containers
- `npm run install-all`: Install dependencies in all directories
- `npm run lint`: Check the code based on `eslint` rules
- `npm run prettier`: Check the code based on `prettier` rules
- `npm run react`: Starts local client app
- `npm run serve-react`: Run the local client as if it were on production
- `npm run stop`: Stops all containers

#### Server side

- `npm start`: Starts the application in a production environment
- `npm run build`: Compiles the code from ES6 to ES5.
- `npm run dev`: Starts the application in a development environment

#### Client side

- `npm start`: Run the app in development mode
- `npm run build`: Builds the app for production to the build folder
