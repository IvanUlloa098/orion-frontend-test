import { IonAlert, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonNote, IonPopover, IonRow, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { addCircle, close} from 'ionicons/icons';
import React, { ChangeEvent, useRef, useState } from 'react';
import movie from '../types/movie';
import './SelectedMovieDetails.css'
import MovieDataService from '../services/MovieDataManagment/service';

interface ContainerProps { 
    dismissCreateMovieModal: () => void;
};

const CreateNewMovie: React.FC<ContainerProps> = (props) => { 
    const movie = {} as movie; // Object of movie type containing all the details neccesary to create a new entry
    const validInput = Array(6).fill(null); // Input array to set th default validation value
    movie.actor = ['', '', ''];
    movie.image = "";
    
    // States used for certain information and for alerts to pop up
    const [showAlert, setShowAlert] = useState(false);
    const [showCreateAlert, setShowCreateAlert] = useState(false);
    const [showImageAlert, setShowImageAlert] = useState(false);
    const [ datePublished, setDatePublished ] = useState('');
    const [file, setFile] = useState<string>(); // File uploaded state
    const [ notSaved, setNotSaved ] = useState(true); // State of data entered
    const [isValid, setIsValid] = useState<boolean[]>(validInput); // State to determine required inputs
    const [movieCreated, setMovieCreated] = useState<movie>(movie);
    const [ movieGenreSelected, setMovieGenreSelected ] = useState<string>('');
    
    // References for every input containing the details of the movie
    const tittleInputRef = useRef<HTMLIonInputElement>(null);
    const directorInputRef = useRef<HTMLIonInputElement>(null);
    const dateInputRef = useRef<HTMLIonInputElement>(null);
    const actor1InputRef = useRef<HTMLIonInputElement>(null);
    const actor2InputRef = useRef<HTMLIonInputElement>(null);
    const actor3InputRef = useRef<HTMLIonInputElement>(null);
    const descriptionInputRef = useRef<HTMLIonTextareaElement>(null);
    const inputFileRef = useRef<HTMLInputElement | null>(null);

    // Change the previous date displayed to the one selected
    const handleDate = (evt: any) => {
        const date = evt.target.value.substr(0, 10); 
        setDatePublished(date);
        prepareData();
        setMovieCreated(movie);
    }

    // Method used to store a snapshot of the current date present in the inputs 
    // This method will prevent data loss if the inputs get reset to the default value
    const prepareData = () => {
        movie.name = tittleInputRef.current?.value?tittleInputRef.current?.value.toString():'';
        movie.director = directorInputRef.current?.value?directorInputRef.current?.value.toString():'';
        movie.genre = movieGenreSelected;
        movie.datePublished = dateInputRef.current?.value?dateInputRef.current?.value.toString():'';
        movie.description = descriptionInputRef.current?.value?descriptionInputRef.current?.value.toString():'';
        movie.actor[0] = actor1InputRef.current?.value+'';
        movie.actor[1] = actor2InputRef.current?.value+'';
        movie.actor[2] = actor3InputRef.current?.value+'';
        movie.image = file? file:"";
    }

    // Method triggered when data is submitted
    const submit = async () => {
        prepareData();  
        validate();
        setMovieCreated(movie);    

        if(validInput.filter((x, i) => x === true && i !==1).length >= 6){
            // Alert pop up to confirm movie creation
            setShowCreateAlert(true);  
        }     
    };

    // Determines if all the information required has been entered
    const validate = () => {
        const movieCopy = movie;
        const validInputCopy = validInput;

        Object.entries(movieCopy).forEach(([key, value], index) => {
            console.log(key);
            validInputCopy[index] = (value==='undefined' || value==='')?false:true; 
        });
        
        const expression = movieCopy.actor.filter(x => x !== '' || x === undefined).length;
        validInputCopy[0] = expression>0 && expression<=3
        validInputCopy[4]=movieGenreSelected?true:false;

        setIsValid(validInputCopy.slice());
    };

    // Handles the exit button actions
    const onExitDetails = () => {
        prepareData();
        setMovieCreated(movie);
        // Alert will pop up to discard movie
        setShowAlert(true);
    };

    // Handles the upload new movie poster button to open the device's file explorer
    const handleUploadClick = () => {
        inputFileRef.current?.click();
    };
    
    // Handles file uploading and preview of the image
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        prepareData();
        if (!e.target.files) {
            return;
        }

        const reader = new FileReader();
        const file = e.target.files[0];

        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const height = img.naturalHeight;
                const width = img.naturalWidth;
                const proportionThreshhold1 = (height*0.66) // Proportion based of an stardard movie poster
                const proportionThreshhold2 = (height*0.78) // Proportion to be more forgiving at the time of uploading an image

                // The size of the image will be compared to see if it is a poster
                if((height>=600 && width>=400) && (width>=proportionThreshhold1 && width<=proportionThreshhold2)){
                    convertBase64(file)
                    .then(dataURL => {
                        movie.image = ''+dataURL;   
                        setFile(movie.image);           
                        setMovieCreated(movie);
                    })
                } else {
                    setShowImageAlert(true);
                }
            };
        };
    };

    // Covert image to Base64 to be stored as a string (fake API constraints)
    const convertBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
    
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
    
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    return(
        <>            
            <IonHeader  collapse="fade" mode='ios'>
                {/** Toolbar containing the buttons available for interaction */}
                <IonToolbar>
                    <IonTitle className='ion-padding-top ion-text-center'>Create New Movie</IonTitle> 
                    <IonButtons slot="start" className='ion-padding-start'>                            
                        <IonButton 
                                fill="outline" 
                                form='create-movie-form'
                                type="submit"
                            >
                                <IonIcon icon={addCircle}></IonIcon>
                                <IonText className='hidden xl:flex md:flex'>Create</IonText>
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
                {/** Alert if you exit the modal */}    
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
                   
                {/** Alert to confirm creation */}
                <IonAlert
                    isOpen={showCreateAlert}
                    onDidDismiss={() => setShowCreateAlert(false)}
                    header="Alert"
                    message="Create movie with the details given?"
                    buttons={[
                            {
                                text: 'Confirm',
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

                {/** Alert if the image does not meet the requirements */}
                <IonAlert
                    isOpen={showImageAlert}
                    onDidDismiss={() => setShowImageAlert(false)}
                    header="Upload Alert"
                    subHeader='Image given does not meet the requirements:'
                    message="Taller than wide image, 400 height x 600 width pixels minimum"
                    buttons={[
                            {
                                text: 'OK',
                                role: 'confirm'
                            }]}
                /> 

                <form 
                    id="create-movie-form" 
                    onSubmit={(e) => { e.preventDefault(); submit();}}                        
                >          
                    <IonGrid className='ion-padding'>
                        <IonRow>
                            <IonCol size-md='4' size='auto' size-xl='4' className='ion-text-center'>
                                <div className='relative'>
                                    <IonImg className='w-full detailsPoster' src={file?file:'assets/img/poster-instructions.png'} alt='poster'></IonImg>  
                                    <button type="button" onClick={handleUploadClick} className="absolute inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-md bottom-2 right-2 p-2 px-3 py-2" >
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
                            <IonCol size-md='4' size='auto' size-xl='4'>
                                <IonItem className={`${isValid[2] && 'ion-valid'} ${isValid[2] === false && 'ion-invalid'}`}>
                                    <IonLabel position="stacked">Movie Title</IonLabel>
                                    <IonInput value={movieCreated.name} ref={tittleInputRef} placeholder={'Tittle...'}></IonInput>                                        
                                    <IonNote slot="error">This field is required</IonNote>
                                </IonItem>
                                <IonItem className={`${isValid[3] && 'ion-valid'} ${isValid[3] === false && 'ion-invalid'}`}>
                                    <IonLabel position="stacked">Director</IonLabel>
                                    <IonInput value={movieCreated.director} ref={directorInputRef } placeholder={'Director...'}></IonInput>
                                    <IonNote slot="error">This field is required</IonNote>
                                </IonItem>
                                <IonList>
                                    <IonItem  className={`${isValid[4] && 'ion-valid'} ${isValid[4] === false && 'ion-invalid'}`}>
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
                                <IonItem className={`${isValid[5] && 'ion-valid'} ${isValid[5] === false && 'ion-invalid'}`}>
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
                                <IonItem counter={true} className={`${isValid[6] && 'ion-valid'} ${isValid[6] === false && 'ion-invalid'} descriptionLayout`}>
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