import React from 'react';

const MovieDataFetch=(setMovieCatalog: React.Dispatch<any>)=>{
    fetch('http://localhost:3000/movies'
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
        setMovieCatalog(myJson)
      });
}

export default MovieDataFetch;