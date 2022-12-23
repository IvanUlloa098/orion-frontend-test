import { IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import React, { Dispatch, SetStateAction } from 'react';

interface ContainerProps { 
    selectedMovie: any;
    dismissMovieDetailsModal: () => void;
};

const SelectedMovieDetails: React.FC<ContainerProps> = (props) => {
    //props.setPopMovieDetailsWindow(false);
    return(
        <>{props.selectedMovie && (
        <div>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{props.selectedMovie.name}</IonTitle>
                    <IonButtons slot="start">
                        <IonButton onClick={props.dismissMovieDetailsModal}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <p>TODO here</p>
            </IonContent>
        </div>
        
        )}</>
    )
}

export default SelectedMovieDetails;