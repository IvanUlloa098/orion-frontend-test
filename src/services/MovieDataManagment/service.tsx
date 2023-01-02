/**
 * This service handles the calls to the API (in this case json-server)
 * It includes the methods to
 *    - fetch all data
 *    - update entry given an id
 *    - create a new entry
 *    - delete entry
 *    - get the genres available
 * 
 */

const api_url: string = 'http://localhost:3000/movies';
const movie_genres = ['Action', 'Adventure','Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Sci-Fi', 'Thriller'];

const movieDataFetch = async ()=>{
    
  return fetch(api_url
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){        
        return response.json();
      });
}

const updateMovie = (data: any) => {
  const requestOptions = {
      method: 'PUT',
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data)
  };
  fetch(api_url+"/"+data.id, requestOptions)
      .then(response => response.json());
}

const newEntry = (data: any) => {
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Accept': 'application/json', 
      'Content-Type': 'application/json' 
    },
      body: JSON.stringify(data)
  };
  fetch(api_url, requestOptions)
      .then(response => response.json());
}

const deleteMovie = (data: any) => {
  const requestOptions = {
    method: 'DELETE',
    headers: { 
      'Accept': 'application/json', 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(data)
  };
  fetch(api_url+"/"+data.id, requestOptions)
      .then(response => response.json());
}

const getMovieGenres = () => {
  return movie_genres;
}

const MovieDataService = {
  movieDataFetch,
  updateMovie,
  newEntry,
  deleteMovie,
  getMovieGenres
}

export default MovieDataService;