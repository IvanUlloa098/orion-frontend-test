import { IonButton, IonCard, IonIcon, IonTitle } from '@ionic/react';
import React, { Dispatch, SetStateAction } from 'react';
import './GenreMovieList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { chevronBack, chevronForward } from 'ionicons/icons';

interface ContainerProps { 
    movieCatalog: any;
    showMovieDetailState: number; 
    setShowMovieDetailState: Dispatch<SetStateAction<number>>;
};

/**
 * Componet displayed when sort By genre is selected.
 * The movie posters are displayed on multiple per-genre trays that can be scrolled 
 * with a button (or swiape on mobile).
 * 
 * @param props 
 * @returns 
 */

const GenreMovieList: React.FC<ContainerProps> = props => {
    let allMovieGenres: any[] = []; // Variable used to store all the genres found
    
    // Store all the genre information in allMovieGenres
    props.movieCatalog.map((movie: any) => {
        allMovieGenres = allMovieGenres.concat(movie.genre);
    });
    
    // Filter all the singular genres off the movie catalog
    allMovieGenres = allMovieGenres.filter((item, index) =>{
        return (allMovieGenres.indexOf(item) === index);
    })

    // Get all the movies given a single genre
    const getMovieGivenGenre = (genre: any) => {
        return props.movieCatalog.filter( (obj: any) => obj.genre === genre );
    }

    // Slide to the left button handler
    const slideContentLeft = (index: string) => {
        var slider = document.getElementById(index);
        slider!.scrollLeft = slider!.scrollLeft - 500;
    };

    // Slide to the right button handler
    const slideContentRight = (index: string) => {
        var slider = document.getElementById(index);
        slider!.scrollLeft = slider!.scrollLeft + 500;
    };

    return (
        <>
            {/** The layout was constructed using Tailwind CSS utilities*/}
            {
                allMovieGenres.map((genre, index) =>  
                    <div key={index}>
                        <IonTitle className='ion-padding-top'>{genre}</IonTitle>
                        <div className='ion-padding-start ion-padding-end rounded-md relative flex items-center bg-zinc-900' >
                            <IonButton className='h-[150px] xl:h-[280px] overflow-button' slot='icon-only'  onClick={() => slideContentLeft('slider-'+index)}>
                                <IonIcon  icon={chevronBack}></IonIcon>
                            </IonButton>
                            <div id={'slider-'+index} className='w-full h-full overflow-x-auto scroll whitespace-nowrap scroll-smooth scrollbar' key={index}>                        
                                {getMovieGivenGenre(genre).map((movie: any) => 
                                    <IonCard key={movie.id} className='w-[100px] xl:w-[190px] inline-block genrePoster' >
                                        <img                                                                         
                                            src={movie.image?movie.image:'assets/img/no-poster.jpeg'} 
                                            alt='movie' 
                                            onClick={() => { props.setShowMovieDetailState(movie.id) }} 
                                        />
                                        {!movie.image && (
                                            <div className="absolute bottom-0 left-0 right-0 px-3 bg-gray-800 opacity-70">
                                                <p className="text-sm text-white font-bold">{movie.name}</p>
                                            </div>
                                        )}
                                    </IonCard>
                                    
                                )}
                            </div>  
                            <IonButton className='h-[150px] xl:h-[280px] overflow-button' slot='icon-only' onClick={() => slideContentRight('slider-'+index)}>
                                <IonIcon icon={chevronForward}></IonIcon>
                            </IonButton>                      
                            
                        </div>
                    </div>               
                )
            }
        </>
    );
};

export default GenreMovieList;