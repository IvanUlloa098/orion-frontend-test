import { IonContent, IonGrid, IonHeader, IonItem, IonModal, IonPage, IonTitle } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import './Home.css';
import AllMovieList from '../components/AllMovieList';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToolBar from '../components/ToolBar';
import GenreMovieList from '../components/GenreMovieList';
import SelectedMovieDetails from '../components/SelectedMovieDetails';
import MovieDataService from '../services/MovieDataManagment/service';

const Home: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);
  
  const [ movieCatalog, setMovieCatalog ] = useState<any>();
  const [ movieCatalogSearch, setMovieCatalogSearch ] = useState<any>();
  const [ searchValue, setSearchValue ] = useState<string>('');
  const [ sortValue, setSortValue ] = useState<'all' | 'up' | 'down' | 'genre' | 'favorites'>('all');
  const [ showMovieDetailState, setShowMovieDetailState ] = useState<number>(-1);
  const [ showMovieDetailsModal, setShowMovieDetailsModal ] = useState<boolean>(false);
  const [ movieDetailsEditState, setMovieDetailsEditState ] = useState<boolean>(true);
  const [ movieRating, setMovieRating ] = useState(0);
  const [ favorite, setFavorite ] = useState();

  const searchMovieCatalog = async ( catalog: any, searchValue: string | undefined ) => {
    const movieCatalogCopy = catalog;

    if ( searchValue?.length !== 0 ) {
      const movieCatalogFiltered = movieCatalogCopy.filter((obj: any) => {
        return obj.name.toLowerCase().includes(searchValue!.toLowerCase());
      });

      setMovieCatalogSearch(movieCatalogFiltered);
    } else {
      sortMovieCatalog(movieCatalogCopy, sortValue);
    }
    
  };

  const sortMovieCatalog = async (catalog: any, value: 'all' | 'up' | 'down' | 'genre' | 'favorites') => {
    setSearchValue("");
    const movieCatalogCopy = catalog;
    let movieCatalogSorted: any;

    switch (value) {
      case 'up':
        movieCatalogSorted = movieCatalogCopy.sort((a: any,b: any) => a.name > b.name ? 1 : -1);
        setMovieCatalog(movieCatalogSorted);
        break;
      case 'down':
        movieCatalogSorted = movieCatalogCopy.sort((a: any,b: any) => a.name < b.name ? 1 : -1);
        setMovieCatalog(movieCatalogSorted);
        break;
      case 'favorites':
        movieCatalogSorted = movieCatalog.filter((obj: any) => {return obj.favorite === true})
        setMovieCatalog(movieCatalogSorted);
        break;
      default:
        MovieDataService.movieDataFetch(setMovieCatalog, setMovieCatalogSearch);
        break;
    }

  };

  const dismissMovieDetailsModal = () => {
    modal.current?.dismiss();  
    onMovieDetailsModalDismiss();
  }

  const onMovieDetailsModalDismiss = () => {
    setShowMovieDetailState(-1);
    setMovieDetailsEditState(true);
    setShowMovieDetailsModal(false);
  }
  
  useEffect(()=>{
    if (movieCatalog) {
      searchMovieCatalog(movieCatalog.slice(), searchValue);
    }
  }, [ searchValue ] );
    
  useEffect(() => {
    if (movieCatalog)
      sortMovieCatalog(movieCatalog.slice(), sortValue);
  }, [ sortValue ] );

  useEffect(() => {
    if (showMovieDetailState >= 0){
      setShowMovieDetailsModal(true);
    }
  }, [ showMovieDetailState ] );
  
  useEffect(()=>{
    MovieDataService.movieDataFetch(setMovieCatalog, setMovieCatalogSearch);
  },[ ])

  return (
    <IonPage ref={page}>
      <IonHeader mode='md'>
        <ToolBar searchValue={searchValue} setSearchValue={setSearchValue} sortValue={sortValue} setSortValue={setSortValue} />  
      </IonHeader>
      {movieCatalog && movieCatalog.length>0 && <IonContent fullscreen>
        <IonHeader>
          <IonItem className='ion-text-center'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-film" viewBox="0 0 16 16">
              <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>
            </svg>
            <IonTitle>Movie Catalog</IonTitle>
          </IonItem>          
        </IonHeader> 

        <IonModal onDidDismiss={onMovieDetailsModalDismiss} isOpen={showMovieDetailsModal} id="movie-modal" ref={modal}>
          <SelectedMovieDetails 
            selectedMovie={ movieCatalog.filter((obj: any) => {return obj.id === showMovieDetailState})[0] } 
            dismissMovieDetailsModal={dismissMovieDetailsModal} 
            movieDetailsEditState={movieDetailsEditState}
            setMovieDetailsEditState={setMovieDetailsEditState}
            rating={movieRating}
            setRating={setMovieRating}
            setMovieCatalog={setMovieCatalog}
            setMovieCatalogSearch={setMovieCatalogSearch}
          ></SelectedMovieDetails>
        </IonModal>

        {(sortValue !== 'genre' &&
          sortValue !== 'favorites' &&
         !searchValue)  && ( 
          <IonGrid fixed={true} >
            <IonTitle size='small' color='medium'>{sortValue.toUpperCase()}</IonTitle>
            <AllMovieList movieCatalog={movieCatalog} showMovieDetailState={showMovieDetailState} setShowMovieDetailState={setShowMovieDetailState} />
          </IonGrid>       
        )}

        {(sortValue === 'genre' && !searchValue) && (     
          <div className='container-fluid'>     
            <GenreMovieList showMovieDetailState={showMovieDetailState} setShowMovieDetailState={setShowMovieDetailState} movieCatalog={movieCatalog}/>                     
          </div>
        )}

        {(sortValue === 'favorites')  && ( 
          <IonGrid fixed={true} >
            <IonTitle size='small' color='medium'>{sortValue.toUpperCase()}</IonTitle>
            <AllMovieList movieCatalog={movieCatalog} showMovieDetailState={showMovieDetailState} setShowMovieDetailState={setShowMovieDetailState} />
          </IonGrid>       
        )}

        {(searchValue)  && ( 
          <IonGrid fixed={true} >
            <IonTitle size='small' color='medium'>{sortValue.toUpperCase()}</IonTitle>
            <AllMovieList movieCatalog={movieCatalogSearch} showMovieDetailState={showMovieDetailState} setShowMovieDetailState={setShowMovieDetailState} />
          </IonGrid>       
        )}

      </IonContent>}
    </IonPage>
  );
};

export default Home;
