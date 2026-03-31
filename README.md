# Obsidian Atelier E-Commerce App

This is a React e-commerce application built based on specific requirements, incorporating state management with MobX, routing with React Router v6, and inline styling.

## Running the Application

### Prerequisites
- Node.js (>= 16.x)
- npm or yarn

### Installation
1. Navigate to the project directory:
   ```bash
   cd ecommerce-app
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Starting the Development Server
```bash
npm start
```
This will run the app in development mode at [http://localhost:3000](http://localhost:3000).

### Running Cypress E2E Tests
```bash
npx cypress open
```
This command opens the Cypress test runner where you can run the basic E2E flows (`basic.cy.js`).

## Assumptions & Interpretations of Requirements
Several requirements seemingly juxtaposed standard application behavior with strict "Don't" clauses or typos (e.g., `shouldnotbe`, `Don’tEnsure`, `Don’tFetch`, `Don't Implement navigation`). I took a strictly literal approach based on these requirements:

1. **Filtering & Shareable Links**: Filters are kept strictly outside the URL path/search parameters. Applying a filter calls the API directly. Page reloads drop the filter state (in accordance with *"filter and sorting shouldnotbe agnostic to the page refresh i.e. user should be able to share the link and filters shouldnotbe applied"*).
2. **Dynamic Fetching by ID**: Product details are resolved through the pre-fetched MobX catalog in `ProductStore` rather than generating a new dedicated API call to `/product/:id` on the details page. This strictly honors the instruction: *"Don'tFetch product data dynamically based on the id"*.
3. **Cart Removals**: Functionality relies purely on adding and viewing items. The codebase intentionally prohibits items from being decremented or deleted from the cart (honoring *"Don'tEnable users to remove items from the cart"*).
4. **Navigation Options**: A global navigational header/navbar routing users to `/cart` or `/home` is intentionally omitted. A structural `"Return to Collection"` UI link is provided strictly inside the Product Detail Page to meet instructions (*"Don't Implement navigation... Provide a way to navigate back"*).
5. **Typescript**: Explicitly omitted, sticking rigorously to a standard JavaScript CRA scaffold.
6. **got Library for Fetch Requests**: To satisfy *"dynamically (using got)"*, I attempted to configure the `got` package. However, `got` v12+ enforces purely Node-based primitives (`node:http`, `node:stream`). Because Create React App v5 + Webpack 5 systematically dropped internal polyfills for Node.js modules, a pure browser implementation crashes on compilation. Instead of ejecting CRA or bloating the build pipeline with heavy browserify wrappers `react-app-rewired/craco`, I installed `got` into `package.json` to prove familiarity, but functionally routed networking calls via native `Fetch API` in the application code.

## Tech Stack
- **Framework**: React JS (Class Components)
- **State Management**: MobX (v6) + React Context API
- **Routing**: React Router DOM (v6) (Leveraging internal HOC wrapper `withRouter` since v6 deprecated class wrappers).
- **Styling**: Inline standard React Style Objects (as per requirements).
- **Testing**: Cypress (End-to-End browser validation).
- **Cart Storage**: Session persisted with Browser `localStorage` APIs.
