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

const GenreMovieList: React.FC<ContainerProps> = props => {
    let allMovieGenres: any[] = [];
    props.movieCatalog.map((movie: any, index: any) => {
        allMovieGenres = allMovieGenres.concat(movie.genre[0]);
    });
    
    allMovieGenres = allMovieGenres.filter((item, index) =>{
        return (allMovieGenres.indexOf(item) === index);
    })

    const getMovieGivenGenre = (genre: any) => {
        return props.movieCatalog.filter( (obj: any) => obj.genre[0] === genre );
    }

    const slideContentLeft = (index: string) => {
        var slider = document.getElementById(index);
        slider!.scrollLeft = slider!.scrollLeft - 500;
    };

    const slideContentRight = (index: string) => {
        var slider = document.getElementById(index);
        slider!.scrollLeft = slider!.scrollLeft + 500;
    };

    return (
        <>
            {
                allMovieGenres.map((genre, index) =>  
                <div key={index}>
                    <IonTitle className='ion-padding-top'>{genre}</IonTitle>
                    <div className='ion-padding relative flex items-center' >
                        <IonButton className='overflow-button' slot='icon-only'  onClick={() => slideContentLeft('slider-'+index)}>
                            <IonIcon  icon={chevronBack}></IonIcon>
                        </IonButton>
                        <div id={'slider-'+index} className='w-full h-full overflow-x-auto scroll whitespace-nowrap scroll-smooth scrollbar' key={index}>                        
                            {getMovieGivenGenre(genre).map((movie: any) => 
                                <IonCard key={movie.id} className='w-[190px] inline-block genrePoster' >
                                    <img                                                                         
                                        src={movie.image} 
                                        alt='movie' 
                                        onClick={() => { props.setShowMovieDetailState(movie.id) }} 
                                    />
                                </IonCard>
                                
                            )}
                        </div>  
                        <IonButton className='overflow-button' slot='icon-only' onClick={() => slideContentRight('slider-'+index)}>
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