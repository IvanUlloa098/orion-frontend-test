import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonRow, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { close, heart, heartOutline, pencil } from 'ionicons/icons';
import React, { Dispatch, SetStateAction, useState } from 'react';
import './SelectedMovieDetails.css'
import { Rating } from 'react-simple-star-rating'
import MovieDataService from '../services/MovieDataManagment/service';
import movie from '../types/movie';

interface ContainerProps { 
    selectedMovie: any;
    dismissMovieDetailsModal: () => void;
    movieDetailsEditState: boolean;
    setMovieDetailsEditState: Dispatch<SetStateAction<boolean>>;
    rating: number;
    setRating: Dispatch<SetStateAction<number>>;
    setMovieCatalog: React.Dispatch<any>;
    setMovieCatalogSearch: React.Dispatch<any>;
};

const SelectedMovieDetails: React.FC<ContainerProps> = (props) => {    
    const [ favorite, setFavorite ] = useState(props.selectedMovie?props.selectedMovie.favorite:false);
    
    const handleRating = (rate: number) => {
        props.setRating(rate)
        console.log(rate)
    }

    const onFavoriteMovie = () => {
        props.selectedMovie.favorite = !props.selectedMovie.favorite;
        setFavorite(props.selectedMovie.favorite);
        MovieDataService.likeMovie(props.selectedMovie);
    }

    return(
        <>
            {props.selectedMovie && (
                <>               
                <IonHeader  collapse="fade" mode='ios'>
                    <IonToolbar>
                        <IonTitle className='ion-padding-top ion-text-center'>Movie Details</IonTitle>
                        <IonButtons slot="end">
                            <IonButton 
                                className='ion-padding-end' 
                                fill="outline" 
                                onClick={() => props.setMovieDetailsEditState(false)}
                            >
                                <IonIcon slot='end' icon={pencil}></IonIcon>
                                Edit Movie
                            </IonButton>
                            <IonButton slot='only-icon' onClick={props.dismissMovieDetailsModal}>
                                <IonIcon icon={close}></IonIcon>
                            </IonButton>
                            
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>                    
                    <IonGrid className='ion-padding'>
                        <IonRow>
                            <IonCol className='ion-text-center'>
                                <div className='relative'>
                                    <IonImg className='w-full detailsPoster' src={props.selectedMovie.image}></IonImg> 
                                    <button onClick={onFavoriteMovie} className="absolute heart-button-color top-2 right-2 rounded-full  p-2 items-center m-2" >
                                        <IonIcon  
                                            className='pt-1'                                          
                                            icon={favorite? heart: heartOutline}
                                            size='large'
                                            color='warning'                                            
                                        ></IonIcon>
                                    </button>
                                </div>                                                                                     
                                <IonItem>
                                    <div className='ion-padding-start'>
                                        <Rating 
                                            SVGclassName="inline-block"
                                            readonly={props.movieDetailsEditState}
                                            allowFraction 
                                            onClick={handleRating} 
                                            initialValue={props.selectedMovie.ratingValue} 
                                        />
                                    </div>                                    
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonItem>
                                    <IonLabel position="stacked">Movie Title</IonLabel>
                                    <IonInput disabled={props.movieDetailsEditState} value={props.selectedMovie.name}></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Director</IonLabel>
                                    <IonInput disabled={props.movieDetailsEditState} value={props.selectedMovie.director}></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Genre</IonLabel>
                                    <IonInput disabled={props.movieDetailsEditState} value={props.selectedMovie.genre}></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Release Date</IonLabel>
                                    <IonInput disabled={props.movieDetailsEditState} value={props.selectedMovie.datePublished}></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Actors</IonLabel>
                                    <IonInput disabled={props.movieDetailsEditState} value={props.selectedMovie.actor[0]}></IonInput>
                                    <IonInput disabled={props.movieDetailsEditState} value={props.selectedMovie.actor[1]}></IonInput>
                                    <IonInput disabled={props.movieDetailsEditState} value={props.selectedMovie.actor[2]}></IonInput>
                                </IonItem>
                            </IonCol>
                            <IonCol className='ion-col-description'>
                                <IonItem counter={true} className='descriptionLayout'>
                                    <IonLabel position="stacked" >Description</IonLabel>                                    
                                    <IonTextarea
                                        rows={13}
                                        className='textfieldHeight'
                                        readonly={props.movieDetailsEditState}
                                        disabled={props.movieDetailsEditState}
                                        placeholder="Write your description"
                                        value={props.selectedMovie.description}
                                        maxlength={400}
                                    ></IonTextarea>
                                </IonItem>                                
                            </IonCol>
                        </IonRow>                        
                    </IonGrid>                   
                </IonContent>     
                </>   
            )}
        </>
    )
}

export default SelectedMovieDetails;