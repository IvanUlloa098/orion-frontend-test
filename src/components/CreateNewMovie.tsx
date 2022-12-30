import { IonAlert, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonNote, IonPopover, IonRow, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { addCircle, close, cloudUpload} from 'ionicons/icons';
import React, { ChangeEvent, useRef, useState } from 'react';
import movie from '../types/movie';
import './SelectedMovieDetails.css'
import MovieDataService from '../services/MovieDataManagment/service';

interface ContainerProps { 
    dismissCreateMovieModal: () => void;
};

const CreateNewMovie: React.FC<ContainerProps> = (props) => { 
    const movie = {} as movie;
    const validInput = Array(6).fill(null);
    movie.actor = ['', '', ''];
    
    const [showAlert, setShowAlert] = useState(false);
    const [file, setFile] = useState<File>();
    const [showCreateAlert, setShowCreateAlert] = useState(false);
    const [ datePublished, setDatePublished ] = useState('');
    const [ notSaved, setNotSaved ] = useState(true);
    const [isValid, setIsValid] = useState<boolean[]>(validInput);
    const [movieCreated, setMovieCreated] = useState<movie>(movie);
    const [ movieGenreSelected, setMovieGenreSelected ] = useState<string>('');
    
    const tittleInputRef = useRef<HTMLIonInputElement>(null);
    const directorInputRef = useRef<HTMLIonInputElement>(null);
    const dateInputRef = useRef<HTMLIonInputElement>(null);
    const actor1InputRef = useRef<HTMLIonInputElement>(null);
    const actor2InputRef = useRef<HTMLIonInputElement>(null);
    const actor3InputRef = useRef<HTMLIonInputElement>(null);
    const descriptionInputRef = useRef<HTMLIonTextareaElement>(null);
    const inputFileRef = useRef<HTMLInputElement | null>(null);

    const handleDate = (evt: any) => {
        const date = evt.target.value.substr(0, 10); 
        setDatePublished(date);
        prepareData();
        setMovieCreated(movie);
    }

    const prepareData = () => {
        movie.name = tittleInputRef.current?.value?tittleInputRef.current?.value.toString():'';
        movie.director = directorInputRef.current?.value?directorInputRef.current?.value.toString():'';
        movie.genre = movieGenreSelected;
        movie.datePublished = dateInputRef.current?.value?dateInputRef.current?.value.toString():'';
        movie.description = descriptionInputRef.current?.value?descriptionInputRef.current?.value.toString():'';
        movie.actor[0] = actor1InputRef.current?.value+'';
        movie.actor[1] = actor2InputRef.current?.value+'';
        movie.actor[2] = actor3InputRef.current?.value+'';
    }

    const submit = async () => {
        prepareData();  
        validate();
        setMovieCreated(movie);

        if(validInput.filter((x) => x === true).length === 6){
            setShowCreateAlert(true);  
        }     
    };

    const validate = () => {
        const movieCopy = movie;
        const validInputCopy = validInput;

        Object.entries(movieCopy).forEach(([key, value], index) => {
            validInputCopy[index] = value==='undefined' || value===''?false:true; 
        });
        
        const expression = movieCopy.actor.filter(x => x !== '' || x === undefined).length;
        validInputCopy[0] = expression>0 && expression<=3
        validInput[3]=movieGenreSelected?true:false;

        setIsValid(validInputCopy.slice());
    };

    const onExitDetails = () => {
        prepareData();
        setMovieCreated(movie);
        setShowAlert(true);
    };

    const handleUploadClick = () => {
        inputFileRef.current?.click();
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        setFile(e.target.files[0]);

        // 🚩 do the file upload here normally...
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
                                <IonIcon slot='end' icon={addCircle}></IonIcon>
                                Create
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
                                    props.dismissCreateMovieModal();
                                },
                            },
                            {
                                text:'Cancel',
                                role: 'cancel'
                            }]}
                />   
                <IonAlert
                    isOpen={showCreateAlert}
                    onDidDismiss={() => setShowCreateAlert(false)}
                    header="Alert"
                    message="Create movie with the details given?"
                    buttons={[
                            {
                                text: 'OK',
                                role: 'confirm',
                                handler: () => {
                                    prepareData();
                                    setMovieCreated(movie);
                                    MovieDataService.newEntry(movie);
                                    props.dismissCreateMovieModal();
                                },
                            },
                            {
                                text:'Cancel',
                                role: 'cancel'
                            }]}
                />   
                <form 
                    id="create-movie-form" 
                    onSubmit={(e) => { e.preventDefault(); submit();}}                        
                >          
                    <IonGrid className='ion-padding'>
                        <IonRow>
                            <IonCol className='ion-text-center'>
                                <div className='relative'>
                                    <img className='w-full detailsPoster' src={file?URL.createObjectURL(file):'assets/img/no-poster.jpeg'}></img>  
                                    <button type="button" onClick={handleUploadClick} className="absolute inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-md bottom-2 right-2 p-2 px-4 py-2" >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-5 w-5 mr-2 bi bi-upload" viewBox="0 0 16 16">
                                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                                        </svg>
                                        Upload poster                                  
                                    </button>
                                    <input
                                        type="file"
                                        id="file"
                                        ref={inputFileRef}
                                        accept=".jpg, .png, .jpeg"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />  
                                </div>                                                                                                                                                
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
                                <IonList>
                                    <IonItem  className={`${isValid[3] && 'ion-valid'} ${isValid[3] === false && 'ion-invalid'}`}>
                                        <IonLabel position="stacked">Genre</IonLabel>
                                        <IonSelect 
                                            interface="popover" 
                                            placeholder="Select genre"
                                            onIonChange={(e) => setMovieGenreSelected(e.target.value)}
                                            onClick={() => {prepareData(); setMovieCreated(movie);}}
                                        >
                                            {MovieDataService.getMovieGenres().map((genre, index)=> 
                                                <IonSelectOption key={index} value={genre}>{genre}</IonSelectOption>
                                            )}                                            
                                        </IonSelect>
                                        <IonNote slot="error">This field is required</IonNote>
                                    </IonItem>
                                </IonList>                                
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