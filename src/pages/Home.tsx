import { IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonPage, IonTitle } from '@ionic/react';
import { useEffect, useState } from 'react';
import { colorPaletteSharp } from 'ionicons/icons';
import './Home.css';
import movieDatabase from '../movie-database.json';
import MovieList from '../components/MovieList';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToolBar from '../components/ToolBar';

const Home: React.FC = () => {
  const [ movieCatalog, setMovieCatalog ] = useState(movieDatabase);
  const [ searchValue, setSearchValue ] = useState<string>('');

  const searchMovieCatalog = ( searchValue: string | undefined ) => {
    const movieCatalogCopy = movieDatabase.slice();

    if ( searchValue?.length != 0 ) {
      const movieCatalogFiltered = movieCatalogCopy.filter((obj) => {
        return obj.name.toLowerCase().includes(searchValue!.toLowerCase());
      });

      setMovieCatalog(movieCatalogFiltered);
    } else {
      setMovieCatalog(movieDatabase);
    }
    
  };
  
  useEffect(()=>{
    searchMovieCatalog(searchValue);
  },[ searchValue ]);
    

  return (
    <IonPage>
      <IonHeader mode='md'>
        <ToolBar searchValue={searchValue} setSearchValue={setSearchValue} />  
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader>
          <IonItem className='ion-text-center'>
            <IonIcon icon={ colorPaletteSharp }/>
            <IonTitle>Movie Catalog</IonTitle>
          </IonItem>          
        </IonHeader> 
        <IonGrid fixed={true} className="ion-padding-end">
          <MovieList movieCatalog={movieCatalog} />
        </IonGrid>
        
      </IonContent>
    </IonPage>
  );
};

export default Home;
