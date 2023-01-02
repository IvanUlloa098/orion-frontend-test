import { IonCard, IonCol, IonRow } from '@ionic/react';
import './AllMovieList.css';
import React, { Dispatch, SetStateAction } from 'react';

interface ContainerProps { 
    movieCatalog: any; 
    showMovieDetailState: number; 
    setShowMovieDetailState: Dispatch<SetStateAction<number>>;
};

/**
 * Sorted movies by Last added, Alphabetically ascending, Alphabetically descending 
 * and favorites will be displayed using this component.
 * The movie posters are displayed on a grid and can be clicked to show details.
 * 
 * @param props 
 * @returns 
 */

const AllMovieList: React.FC<ContainerProps> = props => { 
    return (
        <IonRow>
            {props.movieCatalog.map((movie: any, index: any) => 
                <IonCol size='4' size-xl='2' key={movie.id}>      
                    <IonCard 
                        button 
                        onClick={() => { props.setShowMovieDetailState(movie.id) }} 
                        className='moviePoster'
                    >
                        <img  src={movie.image? movie.image: 'assets/img/no-poster.jpeg'} alt='movie' ></img>
                        {/** Movies without a poster image will display their name on top of the default poster instead */}
                        {!movie.image && (
                            <div className="absolute bottom-0 left-0 right-0 px-3 bg-gray-800 opacity-70">
                                <p className="text-sm text-white font-bold">{movie.name}</p>
                            </div>
                        )}
                    </IonCard>        
                </IonCol>
            )}
        </IonRow>  
    );
};

export default AllMovieList;
