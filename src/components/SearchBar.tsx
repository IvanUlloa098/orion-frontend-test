import { IonSearchbar } from '@ionic/react';
import React from 'react';
import './MovieList.css';

interface ContainerProps {  };

const SearchBar: React.FC<ContainerProps> = props => {
    return (
        <>
            <IonSearchbar className='searchBar' showClearButton="focus" animated={true} placeholder="Search for your movie"></IonSearchbar>
        </>
    );
}

export default SearchBar;