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
└───── .gitignore                    # files ignored by git
└───── package.json                  # All dependencies and script to run the application
├───── server/                       # Source directory
|   |   ├── src/                      # All server side code
|   |   |   ├── config/               # Configuration files
|   |   |   └── rest/                 # "heart" of the API
|   |   |   |   └───components        # Each component takes care of its own routes, controller and model
|   |   |   |   utils                 # API's utils
|   |   |   └── services/             # files for external services. E.g: sending mails
|   |   |   └── index.js              # Initialize server and handle routes and services
└───── .babelrc                      # Babel configuration file
└───── .gitignore                    # files ignored by git
└───── package.json                  # All dependencies and script to run the application
└── README.md                     # README file
```

---

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
