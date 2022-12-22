import { IonContent, IonGrid, IonHeader, IonItem, IonPage, IonTitle } from '@ionic/react';
import { useEffect, useState } from 'react';
import './Home.css';
import movieDatabase from '../movie-database.json';
import AllMovieList from '../components/AllMovieList';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToolBar from '../components/ToolBar';
import GenreMovieList from '../components/GenreMovieList';

const Home: React.FC = () => {
  const reverseMovieCatalog = (catalog: any) => {
    const movieCatalogCopy = catalog.slice();

    const movieCatalogSorted = movieCatalogCopy.sort((a: any,b: any) => a.id < b.id ? 1 : -1);
    return movieCatalogSorted;    
  }
  
  const [ movieCatalog, setMovieCatalog ] = useState(() => reverseMovieCatalog(movieDatabase));
  const [ searchValue, setSearchValue ] = useState<string>('');
  const [ sortValue, setSortValue ] = useState<'all' | 'up' | 'down' | 'genre'>('all');

  const searchMovieCatalog = ( searchValue: string | undefined ) => {
    const movieCatalogCopy = movieDatabase.slice();

    if ( searchValue?.length !== 0 ) {
      const movieCatalogFiltered = movieCatalogCopy.filter((obj) => {
        return obj.name.toLowerCase().includes(searchValue!.toLowerCase());
      });

      setMovieCatalog(movieCatalogFiltered);
    } else {
      sortMovieCatalog(sortValue);
    }
    
  };

  const sortMovieCatalog = (value: 'all' | 'up' | 'down' | 'genre') => {
    const movieCatalogCopy = movieDatabase.slice();

    if ( value === 'up' ) {
      const movieCatalogSorted = movieCatalogCopy.sort((a,b) => a.name > b.name ? 1 : -1);
      setMovieCatalog(movieCatalogSorted);
    } else if ( value === 'down' ) {
      const movieCatalogSorted = movieCatalogCopy.sort((a,b) => a.name < b.name ? 1 : -1);
      setMovieCatalog(movieCatalogSorted);
    } else {
      setMovieCatalog(reverseMovieCatalog(movieCatalog));
    }

  };
  
  useEffect(()=>{
    searchMovieCatalog(searchValue);
  }, [ searchValue ] );
    
  useEffect(() => {
    sortMovieCatalog(sortValue);
  }, [ sortValue ] );
  
  return (
    <IonPage>
      <IonHeader mode='md'>
        <ToolBar searchValue={searchValue} setSearchValue={setSearchValue} sortValue={sortValue} setSortValue={setSortValue} />  
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader>
          <IonItem className='ion-text-center'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-film" viewBox="0 0 16 16">
              <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>
            </svg>
            <IonTitle>Movie Catalog</IonTitle>
          </IonItem>          
        </IonHeader> 

        {(sortValue !== 'genre')  && ( 
          <IonGrid fixed={true} >
            <IonTitle size='small' color='medium'>{sortValue.toUpperCase()}</IonTitle>
            <AllMovieList movieCatalog={movieCatalog} />
          </IonGrid>       
        )}

        {sortValue === 'genre' && (
          <div className='container-fluid movie-tray'>
            <GenreMovieList movieCatalog={movieCatalog}/>          
          </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Home;
