import { IonCard, IonCol, IonRow } from '@ionic/react';
import './AllMovieList.css';
import React, { Dispatch, SetStateAction } from 'react';

interface ContainerProps { 
    movieCatalog: any; 
    showMovieDetailState: number; 
    setShowMovieDetailState: Dispatch<SetStateAction<number>>;
};

const AllMovieList: React.FC<ContainerProps> = props => { 
    return (
        <IonRow>
            {props.movieCatalog.map((movie: any, index: any) => 
                <IonCol size='3' size-xl='2' key={movie.id}>      
                    <IonCard 
                        button 
                        onClick={() => { props.setShowMovieDetailState(movie.id) }} 
                        className='moviePoster'
                    >
                        <img  src={movie.image? movie.image: 'assets/img/no-poster.jpeg'} alt='movie' ></img>
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
