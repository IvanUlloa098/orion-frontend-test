import { IonAlert, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonNote, IonPopover, IonRow, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { close, save } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import movie from '../types/movie';
import './SelectedMovieDetails.css'
import MovieDataService from '../services/MovieDataManagment/service';

interface ContainerProps { 
    dismissCreateMovieModal: () => void;
};

const CreateNewMovie: React.FC<ContainerProps> = (props) => { 
    const movie = {} as movie;
    const validInput = Array(6).fill(true);
    movie.actor = ['', '', ''];
    
    const [showAlert, setShowAlert] = useState(false);
    const [ datePublished, setDatePublished ] = useState('');
    const [ notSaved, setNotSaved ] = useState(false);
    const [isValid, setIsValid] = useState<boolean[]>(validInput);
    const [movieCreated, setMovieCreated] = useState<movie>(movie);
    
    const tittleInputRef = useRef<HTMLIonInputElement>(null);
    const directorInputRef = useRef<HTMLIonInputElement>(null);
    const genreInputRef = useRef<HTMLIonInputElement>(null);
    const dateInputRef = useRef<HTMLIonInputElement>(null);
    const actor1InputRef = useRef<HTMLIonInputElement>(null);
    const actor2InputRef = useRef<HTMLIonInputElement>(null);
    const actor3InputRef = useRef<HTMLIonInputElement>(null);
    const descriptionInputRef = useRef<HTMLIonTextareaElement>(null);

    const handleDate = (evt: any) => {
        const date = evt.target.value.substr(0, 10); 
        setDatePublished(date);
        prepareData();
        setMovieCreated(movie);
    }

    const prepareData = () => {
        const actors = [
            actor1InputRef.current?.value+'',
            actor2InputRef.current?.value+'',
            actor1InputRef.current?.value+''
        ]

        movie.name = tittleInputRef.current?.value?tittleInputRef.current?.value.toString():'';
        movie.director = directorInputRef.current?.value?directorInputRef.current?.value.toString():'';
        movie.genre = genreInputRef.current?.value?genreInputRef.current?.value.toString():'';
        movie.datePublished = dateInputRef.current?.value?dateInputRef.current?.value.toString():'';
        movie.description = descriptionInputRef.current?.value?descriptionInputRef.current?.value.toString():'';
        movie.actor = actors;
    }

    const submit = async () => {
        prepareData();  
        validate() 
        setMovieCreated(movie);
         
        MovieDataService.newEntry(movieCreated);          
    };

    const validate = () => {
        const movieCopy = movie;
        Object.entries(movieCopy).forEach(([key, value], index) => {
            validInput[index] = value==='undefined' || value===''?false:true; 
        });

        movieCopy.actor.filter(x => x === '').length < 3? validInput[0]=true: validInput[0]=false;
        setIsValid(validInput.slice());
    };

    const onExitDetails = () => {
        prepareData();
        setShowAlert(true);
    };

    return(
        <>            
            <IonHeader  collapse="fade" mode='ios'>
                <IonToolbar>
                    <IonTitle className='ion-padding-top ion-text-center'>Create New Movie</IonTitle> 
                    <IonButtons slot="start" className='ion-padding-start'>                            
                        <IonButton 
                                fill="outline" 
                                form='create-movie-form'
                                type="submit"
                            >
                                <IonIcon slot='end' icon={save}></IonIcon>
                                Save
                            </IonButton>                            
                        </IonButtons>                       
                    <IonButtons slot="end">                            
                        <IonButton slot='only-icon' onClick={notSaved?onExitDetails:props.dismissCreateMovieModal}>
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
                                    
                                },
                            },
                            {
                                text:'Save and Dismiss',
                                role: 'cancel',
                                handler: () => {
                                    submit();                                        
                                },
                            }]}
                />   
                <form 
                    id="create-movie-form" 
                    onSubmit={(e) => { e.preventDefault(); submit();}}                        
                >          
                    <IonGrid className='ion-padding'>
                        <IonRow>
                            <IonCol className='ion-text-center'>
                                <IonImg className='detailsPoster' src={'assets/img/no-poster.jpeg'}></IonImg>                                                                                     
                            </IonCol>
                            <IonCol>
                                <IonItem className={`${isValid[1] && 'ion-valid'} ${isValid[1] === false && 'ion-invalid'}`}>
                                    <IonLabel position="stacked">Movie Title</IonLabel>
                                    <IonInput value={movieCreated.name} ref={tittleInputRef} placeholder={'Tittle...'}></IonInput>                                        
                                    <IonNote slot="error">This field is required</IonNote>
                                </IonItem>
                                <IonItem className={`${isValid[2] && 'ion-valid'} ${isValid[2] === false && 'ion-invalid'}`}>
                                    <IonLabel position="stacked">Director</IonLabel>
                                    <IonInput value={movieCreated.director} ref={directorInputRef } placeholder={'Director...'}></IonInput>
                                    <IonNote slot="error">This field is required</IonNote>
                                </IonItem>
                                <IonItem  className={`${isValid[3] && 'ion-valid'} ${isValid[3] === false && 'ion-invalid'}`}>
                                    <IonLabel position="stacked">Genre</IonLabel>
                                    <IonInput value={movieCreated.genre} ref={genreInputRef} placeholder={'Genre...'}></IonInput>
                                    <IonNote slot="error">This field is required</IonNote>
                                </IonItem>
                                <IonItem className={`${isValid[4] && 'ion-valid'} ${isValid[4] === false && 'ion-invalid'}`}>
                                    <IonLabel position="stacked">Release Date</IonLabel>
                                    <IonInput
                                        id="click-trigger"
                                        placeholder={'Date...'}
                                        ref={dateInputRef} 
                                        value={datePublished}
                                    ></IonInput>
                                    <IonNote slot="error">This field is required</IonNote>
                                    <IonPopover trigger='click-trigger'>
                                        <IonDatetime
                                            presentation='date'
                                            value={datePublished}
                                            onIonChange={handleDate}
                                        ></IonDatetime>
                                    </IonPopover>
                                </IonItem>
                                <IonItem className={`${isValid[0] && 'ion-valid'} ${isValid[0] === false && 'ion-invalid'}`}>
                                    <IonLabel position="stacked">Actors</IonLabel>
                                    <IonInput value={movieCreated.actor[0]} ref={actor1InputRef} placeholder={'Actor...'}></IonInput>
                                    <IonInput value={movieCreated.actor[1]} ref={actor2InputRef} placeholder={'Actor...'}></IonInput>
                                    <IonInput value={movieCreated.actor[2]} ref={actor3InputRef} placeholder={'Actor...'}></IonInput>
                                    <IonNote slot="error">This field is required</IonNote>
                                </IonItem>
                            </IonCol>
                            <IonCol className='ion-col-description'>
                                <IonItem counter={true} className={`${isValid[5] && 'ion-valid'} ${isValid[5] === false && 'ion-invalid'} descriptionLayout`}>
                                    <IonLabel position="stacked" >Description</IonLabel>                                    
                                    <IonTextarea
                                        value={movieCreated.description}
                                        ref={descriptionInputRef}
                                        rows={13}
                                        className='textfieldHeight'
                                        placeholder="Write your description here..."
                                        maxlength={400}
                                    ></IonTextarea>
                                    <IonNote slot="error">This field is required</IonNote>
                                </IonItem>                                
                            </IonCol>
                        </IonRow>                        
                    </IonGrid>   
                </form>                 
            </IonContent>                            
        </> 
    )
}

export default CreateNewMovie;