# Brainstorm

brainstorm

## Technologies

- [Node.js](https://nodejs.org/en/)

## Folder Structure

```bash
brainstorm
├── src/                          # Source directory
|   ├── server/                   # All server side code
|   |   ├── config/               # Configuration files
|   |   └── rest/                 # "heart" of the API
|   |   |   └───components        # Each component takes care of its own routes, controller and model
|   |   |   └───middleware        # API's middlewares
|   |   └── services/             # files for external services. E.g: sending mails
|   |   └── index.js              # Initialize server and handle routes and services
└── .babelrc                      # Babel configuration file
└── .gitignore                    # files ignored by git
└── package.json                  # All dependencies and script to run the application
└── README.md                     # README file
```

---

### Scripts used on the project

- `npm start`: starts the application
- `npm run build`: Compiles the code from ES6 to ES5.
- `npm run dev`: Starts the application in a development environment
- `npm run lint`: Check the code based on `eslint` rules
- `npm run prettier`: Check the code based on `prettier` rules
