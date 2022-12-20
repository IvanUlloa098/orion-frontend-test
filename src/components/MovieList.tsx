import { IonCard, IonCol, IonRow } from '@ionic/react';
import './MovieList.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ContainerProps { movieCatalog: any };

const MovieList: React.FC<ContainerProps> = props => { 
    return (
        <IonRow>
            {props.movieCatalog.map((movie: any, index: any) => 
                <IonCol size='3' size-sm='2' key={index}>
                    <img className='moviePoster' src={movie.image} alt='movie' ></img>
                </IonCol>
            )}
        </IonRow>  
    );
};

export default MovieList;
