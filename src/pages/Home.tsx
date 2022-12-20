import { IonButton, IonButtons, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonMenuButton, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import { colorPaletteSharp, search, star } from 'ionicons/icons';
import './Home.css';
import movieDatabase from '../movie-database.json';
import MovieList from '../components/MovieList';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBar from '../components/SearchBar';

const Home: React.FC = () => {
  const [ movieCatalog, setMovieCatalog ] = useState([ movieDatabase ]);

  return (
    <IonPage>
      <IonHeader mode='md'>
        <IonToolbar>
          <IonButtons slot="primary">
            <IonButton onClick={() => {}}>
              <IonIcon slot="icon-only" icon={search} />
            </IonButton>
            <IonButton>
              <IonIcon slot="icon-only" icon={star} />
            </IonButton>
          </IonButtons>
          <SearchBar/>
        </IonToolbar>       
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader>
          <IonItem className='ion-text-center'>
            <IonIcon icon={ colorPaletteSharp }/>
            <IonTitle>Movie Catalog</IonTitle>
          </IonItem>          
        </IonHeader> 
        <IonGrid fixed={false}>
          <MovieList movieCatalog={movieDatabase} />
        </IonGrid>
        
      </IonContent>
    </IonPage>
  );
};

export default Home;
