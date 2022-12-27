import { IonAlert, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonPopover, IonRow, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { close, heart, heartOutline, pencil, save, trash } from 'ionicons/icons';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import './SelectedMovieDetails.css'
import { Rating } from 'react-simple-star-rating'
import MovieDataService from '../services/MovieDataManagment/service';

interface ContainerProps { 
    selectedMovie: any;
    dismissMovieDetailsModal: () => void;
    movieDetailsEditState: boolean;
    setMovieDetailsEditState: Dispatch<SetStateAction<boolean>>;
    setMovieCatalog: React.Dispatch<any>;
    setMovieCatalogSearch: React.Dispatch<any>;
};

const SelectedMovieDetails: React.FC<ContainerProps> = (props) => {  
    const [ switchEdit, setSwitchEdit ] = useState(false);
    const [showAlert, setShowAlert] = useState(false);  
    const [ favorite, setFavorite ] = useState(props.selectedMovie?props.selectedMovie.favorite:false);
    const [ rating, setRating ] = useState(props.selectedMovie?props.selectedMovie.ratingValue:0);
    const [ datePublished, setDatePublished ] = useState(props.selectedMovie?props.selectedMovie.datePublished:'');
    
    const tittleInputRef = useRef<HTMLIonInputElement>(props.selectedMovie?props.selectedMovie.title:'');
    const directorInputRef = useRef<HTMLIonInputElement>(props.selectedMovie?props.selectedMovie.director:'');
    const genreInputRef = useRef<HTMLIonInputElement>(props.selectedMovie?props.selectedMovie.genre:'');
    const dateInputRef = useRef<HTMLIonInputElement>(props.selectedMovie?props.selectedMovie.datePublished:'');
    const actor1InputRef = useRef<HTMLIonInputElement>(props.selectedMovie?props.selectedMovie.actor[0]:'');
    const actor2InputRef = useRef<HTMLIonInputElement>(props.selectedMovie?props.selectedMovie.actor[1]:'');
    const actor3InputRef = useRef<HTMLIonInputElement>(props.selectedMovie?props.selectedMovie.actor[2]:'');
    const descriptionInputRef = useRef<HTMLIonTextareaElement>(props.selectedMovie?props.selectedMovie.description:'');
    
    const handleRating = (rate: number) => {
        setRating(rate)
        props.selectedMovie.ratingValue = rate;
        MovieDataService.updateMovie(props.selectedMovie);
    };

    const onFavoriteMovie = () => {
        props.selectedMovie.favorite = !props.selectedMovie.favorite;
        setFavorite(props.selectedMovie.favorite);
        MovieDataService.updateMovie(props.selectedMovie);
    };

    const onEditClick = () => {
        props.setMovieDetailsEditState(false);
    };

    const handleDate = (evt: any) => {
        const date = evt.target.value.substr(0, 10);
        setDatePublished(date);
    }

    const prepareData = () => {
        const actors = [
            actor1InputRef.current.value,
            actor2InputRef.current.value,
            actor1InputRef.current.value
        ]

        props.selectedMovie.name = tittleInputRef.current.value;
        props.selectedMovie.director = directorInputRef.current.value;
        props.selectedMovie.genre = genreInputRef.current.value;
        props.selectedMovie.datePublished = dateInputRef.current.value;
        props.selectedMovie.actor = actors;
        props.selectedMovie.description = descriptionInputRef.current.value;
    }

    const saveEdit = () => {
        prepareData();

        props.setMovieDetailsEditState(true);
        setSwitchEdit(false);
        MovieDataService.updateMovie(props.selectedMovie);          
    };

    const handleInputChange = () => {
        setSwitchEdit(true);
    };

    const onExitDetails = () => {
        prepareData();
        setShowAlert(true);
    };

    return(
        <>
            {props.selectedMovie && (
                <>               
                <IonHeader  collapse="fade" mode='ios'>
                    <IonToolbar>
                        <IonTitle className='ion-padding-top ion-text-center'>Movie Details</IonTitle>
                        <IonButtons slot='start'>
                            <IonButton 
                                className='ion-padding-start' 
                                fill="outline" 
                                onClick={() => {}}
                                color='danger'
                            >
                                <IonIcon slot='end' icon={trash}></IonIcon>
                                Delete
                            </IonButton>
                            {switchEdit?
                            (<IonButton 
                                fill="outline" 
                                onClick={ saveEdit }
                            >
                                <IonIcon slot='end' icon={save}></IonIcon>
                                Save
                            </IonButton>):  
                            (<IonButton 
                                fill="outline" 
                                onClick={onEditClick}
                            >
                                <IonIcon slot='end' icon={pencil}></IonIcon>
                                Edit
                            </IonButton>)}                                                 
                        </IonButtons>
                        <IonButtons slot="end">                            
                            <IonButton slot='only-icon' onClick={switchEdit?onExitDetails:props.dismissMovieDetailsModal}>
                                <IonIcon icon={close}></IonIcon>
                            </IonButton>                            
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>     
                    <IonAlert
                        isOpen={showAlert}
                        onDidDismiss={() => setShowAlert(false)}
                        header="Alert"
                        message="There are unsaved changes"
                        buttons={[
                                {
                                    text: 'Discard',
                                    role: 'confirm',
                                    handler: () => {
                                        props.dismissMovieDetailsModal();
                                    },
                                },
                                {
                                    text:'Save and Dismiss',
                                    role: 'cancel',
                                    handler: () => {
                                        saveEdit();
                                        props.dismissMovieDetailsModal();
                                    },
                                }]}
                    />               
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
                                            transition
                                            onClick={handleRating}
                                            allowFraction 
                                            initialValue={rating} 
                                        />
                                    </div>                                    
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonItem>
                                    <IonLabel position="stacked">Movie Title</IonLabel>
                                    <IonInput 
                                        disabled={props.movieDetailsEditState} 
                                        ref={tittleInputRef} 
                                        value={props.selectedMovie.name}
                                        onIonChange={handleInputChange}                                        
                                    ></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Director</IonLabel>
                                    <IonInput 
                                        disabled={props.movieDetailsEditState}  
                                        ref={directorInputRef } 
                                        value={props.selectedMovie.director}
                                        onIonChange={handleInputChange}
                                    ></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Genre</IonLabel>
                                    <IonInput 
                                        disabled={props.movieDetailsEditState} 
                                        ref={genreInputRef} 
                                        value={props.selectedMovie.genre}
                                        onIonChange={handleInputChange}
                                    ></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Release Date</IonLabel>
                                    <IonInput 
                                        id="click-trigger"
                                        disabled={props.movieDetailsEditState} 
                                        ref={dateInputRef} 
                                        value={datePublished}
                                        onIonChange={handleInputChange}
                                    ></IonInput>
                                    <IonPopover trigger='click-trigger'>
                                        <IonDatetime
                                            presentation='date'
                                            value={datePublished}
                                            onIonChange={handleDate}
                                        ></IonDatetime>
                                    </IonPopover>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Actors</IonLabel>
                                    <IonInput onIonChange={handleInputChange} disabled={props.movieDetailsEditState} ref={actor1InputRef} value={props.selectedMovie.actor[0]}></IonInput>
                                    <IonInput onIonChange={handleInputChange} disabled={props.movieDetailsEditState} ref={actor2InputRef} value={props.selectedMovie.actor[1]}></IonInput>
                                    <IonInput onIonChange={handleInputChange} disabled={props.movieDetailsEditState} ref={actor3InputRef} value={props.selectedMovie.actor[2]}></IonInput>
                                </IonItem>
                            </IonCol>
                            <IonCol className='ion-col-description'>
                                <IonItem counter={true} className='descriptionLayout'>
                                    <IonLabel position="stacked" >Description</IonLabel>                                    
                                    <IonTextarea
                                        onIonChange={handleInputChange}
                                        ref={descriptionInputRef}
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