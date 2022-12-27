import React from 'react';

const api_url: string = 'http://localhost:3000/movies';

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

const movieDataFetchAlternate = (setMovieCatalog: React.Dispatch<any>)=>{
    
  fetch(api_url
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){        
        return response.json();
      })
      .then(function(myJson) {
        setMovieCatalog(myJson);
      });
  
}

const updateMovie=(data: any) => {
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

const MovieDataService = {
  movieDataFetch,
  updateMovie,
  movieDataFetchAlternate
}

export default MovieDataService;