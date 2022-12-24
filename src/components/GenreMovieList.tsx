import { IonCard, IonTitle } from '@ionic/react';
import React, { Dispatch, SetStateAction } from 'react';
import './GenreMovieList.css';

interface ContainerProps { 
    movieCatalog: any;
    showMovieDetailState: number; 
    setShowMovieDetailState: Dispatch<SetStateAction<number>>;
 };

const GenreMovieList: React.FC<ContainerProps> = props => {
    let allMovieGenres: any[] = [];
    props.movieCatalog.map((movie: any, index: any) => {
        allMovieGenres = allMovieGenres.concat(movie.genre[0])
    });
    
    allMovieGenres = allMovieGenres.filter((item, index) =>{
        return (allMovieGenres.indexOf(item) == index)
    })

    const getMovieGivenGenre = (genre: any) => {
        return props.movieCatalog.filter( (obj: any) => obj.genre[0] === genre )
    }

    return (
        <>
            {
                allMovieGenres.map((genre, index) =>  
                    <div key={index}>
                        <IonTitle className='ion-padding'>{genre}</IonTitle>
                        <div className='row' key={index}>                        
                            {getMovieGivenGenre(genre).map((movie: any, index: any) => 
                                <div className='genrePoster' key={movie.id}>
                                    <IonCard 
                                        className='ion-no-padding'><img src={movie.image} 
                                        alt="movie" 
                                        onClick={() => { props.setShowMovieDetailState(movie.id) }} 
                                    /></IonCard>                    
                                </div>
                            )}
                        </div>
                    </div>

                )
            }
        </>
    );
};

export default GenreMovieList;