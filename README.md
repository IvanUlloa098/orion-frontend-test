# Movie Managment Web Application

Movie Catalog is a web application in which you can view, search, add, edit and delete movies from a database. The application was developed using [Ionic Framework](https://ionicframework.com) in combination with [React](https://es.reactjs.org). Additional styling was done using [Tailwind CSS]( https://tailwindcss.com) utilities.

## Instalation
> **_NOTE:_** This application was developed using [Node.js]( https://nodejs.org) version  ***16.13.1*** higher versions could cause the developer server to fail compiling the React application. It’s recommended to use [NVM]( https://github.com/nvm-sh/nvm) to manage the different versions of Node.

From now on it is assumed that you have used Node.js and NPM in the past. You can download the version required [here]( https://nodejs.org/download/release/v16.13.1/) or use a version manager. 

### Getting started 

The first thing that we will have to do is install the [Ionic Framework CLI]( https://ionicframework.com/docs/intro/cli) on your Node.js environment using NPM:

```bash
npm install -g @ionic/cli
```

Next, you'll need to download or clone this repository. Then using the command line of your operating system (or the Node.js command prompt) navigate to the directory containing the application. Once in the project’s directory (Example: /orion-frontend-test-master) type:

```bash
npm install
```
This will install all the packages required for the project.

### Fake API
This application does not connect to real API by default. What was used to fake an REST API is a JSON file served through [json-server]( https://github.com/typicode/json-server). To install JSON server type:

```bash
npm install -g json-server
```
The repository includes a JSON file ([movie-database.json](https://github.com/IvanUlloa098/orion-frontend-test/blob/master/package.json)) with the example data to create the database to our fake API. Put the file in a directory outside the project’s folder and navigate to it using your operating system command prompt. Once inside the directory containing the JSON file with the example data type: 
```bash
$ json-server --watch movie-database.json

  \{^_^}/ hi!

  Loading movie-database.json
  Done

  Resources
  http://localhost:3000/movies

  Home
  http://localhost:3000

  Type s + enter at any time to create a snapshot of the database
  Watching...
```
The link under Resources will connect us to the JSON file so we can use the standard REST calls to fetch data from it.

> **_NOTE:_** There is a bug that replaces the data of the file used as database with the default resources given as example by json-server. If you don’t see the **/movies** resource just delete *movie-database.json* in your directory and copy it back again from the repository.

### Run the App
As a last step we navigate to the projects folder and start the development server by typing:

```bash
ionic serve
```
The web app will run in the web browser after it compiles. For more information about previewing web application in Ionic Framework read [here]( https://ionicframework.com/docs/developing/previewing).

If the app does not display anything but the search bar, it means that it is not connecting to the fake API. If you are sure that you should be able to connect to *json-server* then maybe the port used is different. In that case, navigate to the projects folder and go to */src/services/MovieDataManagment* and open the *service.tsx* file. Look for this variable:

```bash
const api_url: string = 'http://localhost:3000/movies';
```
Replace the URL found there with the one given to you by *json-server* server and save it. You should now be able to connect to the fake API.



