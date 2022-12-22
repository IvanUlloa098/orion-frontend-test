import { IonCard, IonCol, IonRow } from '@ionic/react';
import './AllMovieList.css';
import React from 'react';

interface ContainerProps { movieCatalog: any };

const AllMovieList: React.FC<ContainerProps> = props => { 
    return (
        <IonRow>
            {props.movieCatalog.map((movie: any, index: any) => 
                <IonCol size='4' size-sm='2' key={index}>      
                    <IonCard className='moviePoster'>
                        <img  src={movie.image} alt='movie' ></img>
                    </IonCard>        
                </IonCol>
            )}
        </IonRow>  
    );
};

export default AllMovieList;
