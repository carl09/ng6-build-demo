# Ng6 Build Demo

This project is a play groung for NGRX, Web Workers and Custom Angular CLI builds

There are 4 projects

1.  **builders**: Angular CLI custom builder def
2.  **state**: the NGRX reducers and shared library contains client and service Module
3.  **webworker**: the web worker service project the hosts the NGRX reducers
4.  **default**: the standard angular cli app to interact with the web worker

## How to use

### Install dependencies

```bash
npm install
# or
yarn
```

### Build the CLI Builders

```bash
npm run builders
# or
yarn builders
```

### Build the State Shared Package

```bash
ng build state
```

### Build the Web Worker Script

```bash
ng build webworker
```

### Run The Application

```bash
ng serve
```

## Testing the Web Worker

The Web Worker can be hosted in a simple html page to debug any issues with build or dev with out complexty of full angular app

_(note: does not reload on index.html changes only typescript files changed)_

```bash
ng serve webworker
```

## Future Ideas

* Create Better Reducer
* Create a better UI with a form to create data for reducer
* maybe use rollup for WebWorker Build as it does not need webpack overhead/features
* investagate how to not have to build state package on each change
* try reduce dependancys on web worker to reduce bundle size (still requires zone.js but no components)
