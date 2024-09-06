# WhiskeyWiz

WhiskeyWiz is a whiskey-tasting experience platform built with Angular and Firebase. It allows users to engage in interactive whiskey tastings, providing insightful feedback and recommendations based on their preferences. This project is designed to run on Firebase with GitHub CI/CD integration for automated deployments.

## Table of Contents

- [WhiskeyWiz](#whiskeywiz)
  - [Table of Contents](#table-of-contents)
  - [Technologies Used](#technologies-used)
  - [Features](#features)
  - [Project Setup](#project-setup)
    - [Pre-requisites](#pre-requisites)
    - [Installation](#installation)
  - [Development Workflow](#development-workflow)
  - [CI/CD Pipeline](#cicd-pipeline)
    - [Firebase Hosting](#firebase-hosting)
    - [GitHub Actions](#github-actions)
  - [Contributing](#contributing)
  - [License](#license)

## Technologies Used

- **Frontend**: Angular 16 (Typescript, CSS)
- **Backend**: Firebase (Firestore, Firebase Functions)
- **Deployment**: Firebase Hosting
- **CI/CD**: GitHub Actions for automated build and deployment

## Features

- Interactive whiskey-tasting platform.
- Firebase integration for user authentication, database, and hosting.
- GitHub Actions for automated CI/CD workflow.
- Deployments triggered automatically on PR merges to the `main` branch.

## Project Setup

### Pre-requisites

Before running the project, ensure you have the following installed:

- **Node.js** (>= 16)
- **npm** (comes with Node.js)
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git** for version control
- **Angular CLI** (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nuwud/whiskeywiz.git
   cd whiskeywiz
   ```

2. **Install the dependencies:**

   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Log in to Firebase using the CLI:

     ```bash
     firebase login
     ```

   - Initialize Firebase (if not already done):

     ```bash
     firebase init
     ```

4. **Configure Environment:**
   - Ensure you have the correct Firebase configuration in `src/environments/environment.ts`.

5. **Run the project locally:**

   ```bash
   ng serve
   ```

   Open `http://localhost:4200/` in your browser to see the app running.

## Development Workflow

1. **Development Server:**
   - Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.
   - The app will automatically reload if you change any of the source files.

2. **Build:**
   - Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
   - Use `ng build --prod` for a production build.

## CI/CD Pipeline

### Firebase Hosting

This project is hosted on Firebase. To deploy the app to Firebase Hosting, use the following command:

```bash
firebase deploy
```

Ensure you are logged in with Firebase CLI and your project is linked to the correct Firebase project.

### GitHub Actions

GitHub Actions is set up to handle CI/CD workflows:

- **Pull Request Workflow**: Automatically builds and previews the application on pull requests.
- **Merge Workflow**: Automatically deploys to Firebase Hosting when changes are merged into the `main` branch.

## Contributing

Contributions are welcome! Please follow these steps for contributing:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Push to your fork and create a pull request.
5. Ensure all CI checks pass before requesting a review.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---
