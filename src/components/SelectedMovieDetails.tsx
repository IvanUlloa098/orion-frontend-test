import { IonAlert, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPopover, IonRow, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { close, create, heart, heartOutline, save, trash } from 'ionicons/icons';
import React, { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react';
import './SelectedMovieDetails.css'
import { Rating } from 'react-simple-star-rating'
import MovieDataService from '../services/MovieDataManagment/service';

interface ContainerProps { 
    selectedMovie: any;
    dismissMovieDetailsModal: () => void;
    movieDetailsEditState: boolean;
    setMovieDetailsEditState: Dispatch<SetStateAction<boolean>>;
};

/**
 * When a movie is selected regardless of the sorting method a modal will pop 
 * up using this component to display the movie details.
 * The information is display in a grid with diferent items containing the details.
 * You can edit and save the details alog side deleting the movie.
 * 
 * @param props 
 * @returns 
 */

const SelectedMovieDetails: React.FC<ContainerProps> = (props) => {  
    // States used for certain information and for alerts to pop up
    const [ switchEdit, setSwitchEdit ] = useState(false); // Click on Edit button state
    const [file, setFile] = useState<string>(); // File uploaded state
    const [showAlertClose, setShowAlertClose] = useState(false);  
    const [showAlertDeletion, setShowAlertDeletion] = useState(false);
    const [showImageAlert, setShowImageAlert] = useState(false);
    const [ favorite, setFavorite ] = useState(props.selectedMovie?props.selectedMovie.favorite:false); // Add to favorites button state
    const [ rating, setRating ] = useState(props.selectedMovie?props.selectedMovie.ratingValue:0); // Change rating state
    const [ datePublished, setDatePublished ] = useState(props.selectedMovie?props.selectedMovie.datePublished:'');
    const [ movieGenreSelected, setMovieGenreSelected ] = useState<string>(props.selectedMovie?props.selectedMovie.genre:'');
    
    // References for every input containing the details of the movie
    const tittleInputRef = useRef<HTMLIonInputElement>(props.selectedMovie?props.selectedMovie.title:'');
    const directorInputRef = useRef<HTMLIonInputElement>(props.selectedMovie?props.selectedMovie.director:'');
    const dateInputRef = useRef<HTMLIonInputElement>(props.selectedMovie?props.selectedMovie.datePublished:'');
    const actor1InputRef = useRef<HTMLIonInputElement>(props.selectedMovie?props.selectedMovie.actor[0]:'');
    const actor2InputRef = useRef<HTMLIonInputElement>(props.selectedMovie?props.selectedMovie.actor[1]:'');
    const actor3InputRef = useRef<HTMLIonInputElement>(props.selectedMovie?props.selectedMovie.actor[2]:'');
    const descriptionInputRef = useRef<HTMLIonTextareaElement>(props.selectedMovie?props.selectedMovie.description:'');
    const inputFileRef = useRef<HTMLInputElement | null>(null);

    // Change the rating to the one currently selected and update the data calling the API
    const handleRating = (rate: number) => {
        setRating(rate)
        props.selectedMovie.ratingValue = rate;
        MovieDataService.updateMovie(props.selectedMovie);
    };

    // Set or remove movie from favorites and update the data calling the API
    const onFavoriteMovie = () => {
        props.selectedMovie.favorite = !props.selectedMovie.favorite;
        setFavorite(props.selectedMovie.favorite);
        MovieDataService.updateMovie(props.selectedMovie);
    };

    // Change the state of the inputs to be able to interact with them
    const onEditClick = () => {
        props.setMovieDetailsEditState(false);
    };

    // Method used to store a snapshot of the current date present in the inputs 
    // This method will prevent data loss if the inputs get reset to the default value
    const prepareData = () => {
        const actors = [
            actor1InputRef.current.value,
            actor2InputRef.current.value,
            actor3InputRef.current.value
        ]

        props.selectedMovie.name = tittleInputRef.current.value;
        props.selectedMovie.director = directorInputRef.current.value;
        props.selectedMovie.genre = movieGenreSelected;
        props.selectedMovie.datePublished = dateInputRef.current.value;
        props.selectedMovie.actor = actors;
        props.selectedMovie.description = descriptionInputRef.current.value;
        props.selectedMovie.image = file? file:props.selectedMovie.image;
    }

    // Save editted data to the database calling the API
    const saveEdit = () => {
        prepareData();
        props.setMovieDetailsEditState(true);
        setSwitchEdit(false);
        MovieDataService.updateMovie(props.selectedMovie);          
    };

    // Handle change on any input to enable the save button
    const handleInputChange = async () => {
        prepareData();
        setSwitchEdit(true);
    };

    // Handle change on the genre input to enable the save button
    const handleInputChangeGenre = (evt: string) => {
        prepareData();
        setSwitchEdit(true);
        setMovieGenreSelected(evt);
    };

    // Change the previous date displayed to the one selected
    const handleDate = (evt: any) => {
        prepareData();
        const date = evt.target.value.substr(0, 10);
        setDatePublished(date);
    }

    // Determines if the changes have been saved or not
    const onExitDetails = () => {
        prepareData();
        setShowAlertClose(true);
    };

    // Deletes the movie if Confirm is selected
    const onConfirmDeletion = () => {
        MovieDataService.deleteMovie(props.selectedMovie);
        props.dismissMovieDetailsModal();
    }

    // Handles the upload new movie poster button to open the device's file explorer
    const handleUploadClick = () => {
        inputFileRef.current?.click();
    };
    
    // Handles file uploading and preview of the image
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        prepareData();
        setSwitchEdit(true);

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
                        props.selectedMovie.image = ''+dataURL;    
                        setFile(props.selectedMovie.image);
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
            {props.selectedMovie && (
                <>               
                <IonHeader  collapse="fade" mode='ios'>
                    {/** Toolbar containing the buttons available for interaction */}
                    <IonToolbar>
                        <IonTitle className='ion-padding-top ion-text-center'>Movie Details</IonTitle>
                        <IonButtons slot='start'>
                            <IonButton 
                                className='ion-padding-start' 
                                fill="outline" 
                                onClick={() => setShowAlertDeletion(true)}
                                color='danger'
                            >
                                <IonIcon icon={trash}></IonIcon>
                                <IonText className='hidden xl:flex md:flex'>Delete</IonText>
                            </IonButton>
                            {switchEdit?
                            (<IonButton 
                                fill="outline" 
                                onClick={ saveEdit }
                            >
                                <IonIcon icon={save}></IonIcon>
                                <IonText className='hidden xl:flex md:flex'>Save</IonText>
                            </IonButton>):  
                            (<IonButton 
                                fill="outline" 
                                onClick={onEditClick}
                            >
                                <IonIcon icon={create}></IonIcon>
                                <IonText className='hidden xl:flex md:flex'>Edit</IonText>
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
                    {/** Alert if changes have not been saved */}    
                    <IonAlert
                        isOpen={showAlertClose}
                        onDidDismiss={() => setShowAlertClose(false)}
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
                                    text:'Save and Close',
                                    role: 'cancel',
                                    handler: () => {
                                        saveEdit();
                                        props.dismissMovieDetailsModal();
                                    },
                                }]}
                    />  

                    {/** Alert when deletion button is clicked */}
                    <IonAlert
                        isOpen={showAlertDeletion}
                        onDidDismiss={() => setShowAlertDeletion(false)}
                        header="Delete movie"
                        message="Delete this movie from your catalog?"
                        buttons={[
                                {
                                    text: 'Comfirm',
                                    role: 'confirm',
                                    handler: onConfirmDeletion,
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

                    <IonGrid className='ion-padding'>
                        <IonRow>
                            <IonCol size-md='4' size='auto' size-xl='4' className='ion-text-center'>
                                {/** Heart button to add movies to favorites */}
                                <div className='relative'>
                                    <IonImg className='w-full detailsPoster' src={props.selectedMovie.image?props.selectedMovie.image:'assets/img/no-poster.jpeg'}></IonImg> 
                                    <button onClick={onFavoriteMovie} className="absolute heart-button-color top-2 right-2 rounded-full  p-2 items-center m-2" >
                                        <IonIcon  
                                            className='pt-1'                                          
                                            icon={favorite? heart: heartOutline}
                                            size='large'
                                            color='warning'                                            
                                        ></IonIcon>
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={handleUploadClick} 
                                        hidden={props.movieDetailsEditState}
                                        className="absolute inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-md bottom-2 right-2 p-2 px-3 py-2" 
                                    >
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
                                        disabled={props.movieDetailsEditState}
                                    />  
                                </div>    
                                {/** Star rating component */}                                                                                 
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
                                <IonList>
                                    <IonItem>
                                        <IonLabel position="stacked">Genre</IonLabel>
                                        <IonSelect
                                            interface="popover" 
                                            placeholder="Select genre"
                                            value={movieGenreSelected}
                                            disabled={props.movieDetailsEditState}
                                            onIonChange={(e) => handleInputChangeGenre(e.target.value)}
                                            onClick={() => prepareData()}
                                        >
                                            {MovieDataService.getMovieGenres().map((genre, index)=> 
                                                <IonSelectOption key={index} value={genre}>{genre}</IonSelectOption>
                                            )}                                            
                                        </IonSelect>
                                    </IonItem>
                                </IonList>    
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
                                        onIonInput={handleInputChange}
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