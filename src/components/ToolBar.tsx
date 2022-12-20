import { IonButton, IonButtons, IonIcon, IonSearchbar, IonToolbar } from '@ionic/react';
import { search, star } from 'ionicons/icons';
import React, { Dispatch, SetStateAction } from 'react';

interface ContainerProps { searchValue: string; setSearchValue: Dispatch<SetStateAction<string>> };

const ToolBar: React.FC<ContainerProps> = props => {
    return (
        <>
            <IonToolbar>
            <IonButtons slot="primary">
                <IonButton onClick={() => {}}>
                    <IonIcon slot="icon-only" icon={search} />
                </IonButton>
                <IonButton>
                    <IonIcon slot="icon-only" icon={star} />
                </IonButton>
            </IonButtons>
            <IonSearchbar value={props.searchValue} onIonChange={
                (event) => props.setSearchValue(event.detail.value!)
            } showClearButton="focus" placeholder="Search for your movie"></IonSearchbar>
            </IonToolbar>
        </>
    );
}

export default ToolBar;