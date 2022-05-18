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
├───── app/                          #  All of the client side code
|   |  ├── public/                   # All public assets
|   |  ├── src/
|   |   |   ├── config/              # Configuration files
|   |   |   ├── constants/           # Constant files for the forms and components
|   |   |   ├── containers/          # React containers
|   |   |   ├── components/          # React components
|   |   |   └──  helpers/            # Helper functions used in the frontend section of the file
├───── pwa/                          # All of the mobile app side code - same structure as app/
├───── server/                       # All server side code
|   |   ├── src/                     # Source directory for the server
|   |   |   ├── config/              # Configuration files
|   |   |   ├── rest/                # "heart" of the API
|   |   |   |   ├── components       # Each component takes care of its own routes, controller and model
|   |   |   |   └── utils            # API's utils
|   |   |   └── services/            # files for external services. E.g: sending mails
|   |   |   └── index.js             # Initialize server and handle routes and services
|   |   |   └── serviceAccountKey.json # Keys for the firebase app
└── package.json                     # All dependencies and script to run the application
└── babel.config.js                  # Babel configuration file
└── Dockerfile                       # file that contains the commands needed to assemble an image
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
- Add the neccessary environment variables for the server in its own `.env` file in `/server/.env`, `/app/.env`, `/pwa/.env` (More info on the [this](https://github.com/ect-pucmm/quiz-up#environment-variables) section)
- When you're in the root directory type the command `npm run install-all` and then:
  - To start the server in a local environment:
    ```bash
    docker-compose up
    ```
  - To start the client admin app:
    ```bash
    npm run react
    ```
    -To start the mobile app:
    ```bash
    npm run pwa
    ```
    - To `install` the app you need to run `npm run serve-pwa` and after that run `ngrok` on port 5000 and open the app in the `https` URL.

### Environment variables

- For the admin dashboard `(/app/.env)` and the PWA `(/pwa/.env)`:

  - REACT_APP_QU_BASE_API: URL that will be calling the server/API (e.g:https://myDomain.com)
  - REACT_APP_QU_LOCAL_API: URL that will be using the server/API locally (e.g:http://localhost:5000)

- For the server `(/server/.env)`:
  - **PORT**: Port number to run the API
  - **MONGO_URI**: URI to connect to the mongo database locally
  - **MONGO_DOCKER_URI**: URI to connect to the mongo database in docker
  - **NODE_ENV**: Node environment value
  - **GOOGLE_APPLICATION_CREDENTIALS**: Firebase credentials used for the user management

### Scripts used on the project

#### General scripts

- `npm run burn`: Stops and removes all containers
- `npm run install-all`: Install dependencies in all directories
- `npm run lint`: Check the code based on `eslint` rules
- `npm run prettier`: Check the code based on `prettier` rules
- `npm run react`: Starts local client app
- `npm run pwa`: Start the mobile app locally
- `npm run serve-react`: Run the local client as if it were on production
- `npm run serve-pwa`: Run the mobile app as if it were on production
- `npm run stop`: Stops all containers

#### Server side

- `npm start`: Starts the application in a production environment
- `npm run build`: Compiles the code from ES6 to ES5.
- `npm run dev`: Starts the application in a development environment

#### Client side

- `npm start`: Run the app in development mode
- `npm run build`: Builds the app for production to the build folder

#### Mobile app

- `npm start`: Run the app in development mode
- `npm run build`: Builds the app for production to the build folder

---

### Development Experience (VSCode - Optional).

Integrating ESLint and Prettier into VSCode

1. Add the prettier extension (Extension ID: `esbenp.prettier-vscode`)
2. Add the ESLint extension (Extension ID: `dbaeumer.vscode-eslint`) and restart VSCode afterwards.
3. Create and/or go to your `.vscode/settings.json` file at the root of this project.
4. Copy the following chunk in your `settings.json` file:

- ```json
  {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "editor.quickSuggestions": {
      "strings": true
    }
  }
  ```
