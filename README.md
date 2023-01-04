# Movie Managment Web Application

Movie Catalog is a web application in which you can view, search, add, edit and delete movies from a database. The application was developed using [Ionic Framework](https://ionicframework.com) in combination with [React](https://es.reactjs.org). Additional styling was done using [Tailwind CSS]( https://tailwindcss.com) utilities.

## Instalation
> **_NOTE:_** This application was developed using [Node.js]( https://nodejs.org) version  ***16.13.1***. Higher versions could cause the developer server to fail compiling the React application. It’s recommended to use [NVM]( https://github.com/nvm-sh/nvm) to manage the different versions of Node.

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
The repository includes a JSON file ([movie-database.json](https://github.com/IvanUlloa098/orion-frontend-test/blob/master/package.json)) with the example data to create the database to our fake API. Put the file in a directory outside the project’s folder and navigate to it using your operating system command prompt. Once inside the directory containing the JSON file with the example data, type: 
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

```typescript
const api_url: string = 'http://localhost:3000/movies';
```
Replace the URL found there with the one given to you by *json-server* server and save it. You should now be able to connect to the fake API.

<a name="overview"></a>

## Overview & Features
> **_NOTE:_** The intended experience of this project is as a desktop web application using Google Chrome, Opera and Microsoft Edge (platforms tested). Some mobile optimizations are included and can be tested with the development tools present in these web browsers.

### Home Screen
Once the application is running in a web browser you will be greeted with the Home Screen with the example data. The movie posters are display on a grid:

![home screen](https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/home_screen.png?raw=true)

In the top right of the screen, we find the sorting methods for our movie catalog. We got two buttons: Sort to display an overlay list and Favorites to list the movies we liked. The overlay list shows us that we can sort by: 

![sort menu](https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/sorting_values.png?raw=true)

The “Last added” method being the default one. The top three will display the movies in a similar fashion with the posters on a grid, but the sort “By genre” will display multiple trays per-genre alongside a left and right scrolling button:  

![sort menu](https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/genre_sorting.png?raw=true)

*Additionally-* Movies created without a poster art will display a default poster with the tittle of the movie at the bottom.

You can also search the movie by tittle using the search bar on the top. It will automatically filter the content already loaded:

![search movie](https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/searching_movie.png?raw=true)

### Movie Details

You can click on any of the movies displayed to show its details. When in this screen we will see the poster of the movie on the left and the details on the right in a grid layout: 

![movie details](https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/movie_details.png?raw=true)

In this window you can also use the heart button on the top right of the poster ( <img src="https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/like_button.png?raw=true" height="25" alt="heart-button"> ) to like a movie and add it to your favorite list. You can also rate the movie using a five-star system ( <img src="https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/rating_movie.png?raw=true" height="20" alt="rating"> ).

Wen can also take a look at the top left of this windows and you will find the edit button ( <img src="https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/edit_button.png?raw=true" height="25" alt="edit-button"> ). When you click it, enables the inputs so you can modify the current details of the movie. Once you have made your first edit the save button ( <img src="https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/Screenshot%202023-01-03%20120524.png?raw=true" height="25" alt="save-button"> ) will replace the edit button on the top left so you can save the changes made. If we exit the window while editing the movie you can choose to discard the changes or save them and close the window:

![details alert](https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/alert_details.png?raw=true)

If you click the upload poster button ( <img src="https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/upload_button.png?raw=true" height="25" alt="upload-button"> ) you can change you image set as poster for the movie. The image must be poster-like, meaning taller than wide and the size will be 400 height x 600 width pixels minimum.

The last button found in this component is the delete button ( <img src="https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/Screenshot%202023-01-03%20120444.png?raw=true" height="25" alt="upload-button"> ) which is pretty straight forward, if you click it a dialogue will pop up asking us if we want to delete the current movie if we click ok the window will close and the movie will be deleted.

### Create Movie

The [+ NEW MOVIE] button is located on the top right of the home screen (in color blue). It will lead us to the create movie window overlay. Has an identical layout to the previous movie details window, we will see the instructions poster detailing the size of the image required if you wan to upload a poster on the left. On the right we see the details we need to input. 

![create movie](https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/create_movie.png?raw=true)

In the same way you got an upload poster button to open the system’s file explorer and add an image to your movie, as long as the poster fits the requirements. There repository contains some example posters to upload in [example-posters.zip](https://github.com/IvanUlloa098/orion-frontend-test/blob/master/example-posters.zip)

Once we are done inserting the details we can click the create button ( <img src="https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/create_button.png?raw=true" height="25" alt="upload-button"> ) to create our new movie. *All details are required* to be filled except for the movie poster. If any detail is missing a note will appear underneath it: 

![create movie](https://github.com/IvanUlloa098/orion-frontend-test/blob/master/public/assets/img/tutorial/required_field.png?raw=true)

If all the details are filled an alert will pop up asking if we want to create the movie, we click confirm and the movie will be added to the database.