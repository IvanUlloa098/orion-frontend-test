import React from 'react';

const saveToJson=() => {
    // Simple POST request with a JSON body using fetch
    const data = {
        "id": 23,
        "name": "WALL·E",
        "actor": [
              "Ben Burtt",
              "Elissa Knight",
              "Jeff Garlin"
        ],
        "ratingValue": 4.5,
        "contentRating": "G",
        "datePublished": "2008-06-27",
        "description": "In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.",
        "director": "Andrew Stanton",
        "duration": "PT1H38M",
        "genre": [
            "Animation",
            "Adventure",
            "Family"
        ],
        "image": "https://m.media-amazon.com/images/M/MV5BMjExMTg5OTU0NF5BMl5BanBnXkFtZTcwMjMxMzMzMw@@._V1_.jpg",
        "@type": "Movie"
    }
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    fetch('http://localhost:3000/movies', requestOptions)
        .then(response => response.json());
}

export default saveToJson;