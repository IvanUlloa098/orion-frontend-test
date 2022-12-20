import { IonCard, IonCol, IonRow } from '@ionic/react';
import './MovieList.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ContainerProps { movieCatalog: any };

const MovieList: React.FC<ContainerProps> = props => { 
    return (
        <IonRow>
            {props.movieCatalog.map((movie: any, index: any) => 
                <IonCol  size='4' size-sm='3' key={index}>      
                    <IonCard className='moviePoster'>
                        <img  src={movie.image} alt='movie' ></img>
                    </IonCard>        
                </IonCol>
            )}
        </IonRow>  
    );
};

export default MovieList;
