import { IonButton, IonButtons, IonIcon, IonItem, IonList, IonListHeader, IonPopover, IonSearchbar, IonToolbar } from '@ionic/react';
import { filter, funnel, star } from 'ionicons/icons';
import React, { Dispatch, SetStateAction, useState } from 'react';

interface ContainerProps { 
    searchValue: string; 
    setSearchValue: Dispatch<SetStateAction<string>>; 
    sortValue: 'all' | 'up' | 'down' | 'genre'; 
    setSortValue: Dispatch<SetStateAction<'all' | 'up' | 'down' | 'genre'>>; 
};

const ToolBar: React.FC<ContainerProps> = props => {
    const [popoverState, setShowPopover] = useState({
        showPopover: false,
        event: undefined,
    });

    const onSortValueSelected = (value: 'all' | 'up' | 'down' | 'genre') => {
        props.setSortValue(value)
    };
    
    return (
        <>
            <IonPopover
                event={popoverState.event}
                isOpen={popoverState.showPopover}
                onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
                backdropDismiss={true}
                dismissOnSelect={true}
            >
                <IonList>
                    <IonItem button onClick={() => onSortValueSelected('all')} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                        </svg>
                        <div className='ion-padding-start'>Last added</div>
                    </IonItem>
                    <IonItem button onClick={() => onSortValueSelected('up')} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                            <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                        </svg>
                        <div className='ion-padding-start'>Alphabetically ascending</div> 
                    </IonItem>                        
                    <IonItem button onClick={() => onSortValueSelected('down')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-alpha-up" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                            <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zm-8.46-.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"/>
                        </svg>
                        <div className='ion-padding-start'>Alphabetically descending</div>
                    </IonItem>
                    <IonItem button onClick={() => onSortValueSelected('genre')} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel-fill" viewBox="0 0 16 16">
                            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
                        </svg>
                        <div className='ion-padding-start'>By genre</div> 
                    </IonItem>                    
                </IonList>
            </IonPopover>

            <IonToolbar>
                <IonButtons slot="primary">
                    <IonButton onClick={(e: any) => {
                        e.persist();
                        setShowPopover({ showPopover: true, event: e });
                        }}
                    >
                        <IonIcon slot='start' icon={filter} />  
                        Sort                         
                    </IonButton>                   
                    <IonButton>
                        <IonIcon slot='start' icon={star} />
                        Favorites
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