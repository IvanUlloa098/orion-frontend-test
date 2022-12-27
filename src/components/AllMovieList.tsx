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
                <IonCol size='4' size-sm='2' key={movie.id}>      
                    <IonCard 
                        button 
                        onClick={() => { props.setShowMovieDetailState(movie.id) }} 
                        className='moviePoster'
                    >
                        <img  src={movie.image? movie.image: 'assets/img/no-poster.jpeg'} alt='movie' ></img>
                    </IonCard>        
                </IonCol>
            )}
        </IonRow>  
    );
};

export default AllMovieList;
