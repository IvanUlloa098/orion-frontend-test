import { IonButton, IonButtons, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import './Home.css';
import AllMovieList from '../components/AllMovieList';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToolBar from '../components/ToolBar';
import GenreMovieList from '../components/GenreMovieList';
import SelectedMovieDetails from '../components/SelectedMovieDetails';
import MovieDataService from '../services/MovieDataManagment/service';
import { add } from 'ionicons/icons';
import CreateNewMovie from '../components/CreateNewMovie';

const Home: React.FC = () => {
  const modalMovieDetails = useRef<HTMLIonModalElement>(null);
  const modalCreateMovie = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);
  
  const [ movieCatalog, setMovieCatalog ] = useState<any>();
  const [ fetchCall, setFetchCall ] = useState<boolean>(true);
  const [ movieCatalogSearch, setMovieCatalogSearch ] = useState<any>();
  const [ searchValue, setSearchValue ] = useState<string>('');
  const [ sortValue, setSortValue ] = useState<'all' | 'up' | 'down' | 'genre' | 'favorites'>('all');
  const [ showMovieDetailState, setShowMovieDetailState ] = useState<number>(-1);
  const [ showMovieDetailsModal, setShowMovieDetailsModal ] = useState<boolean>(false);
  const [ showCreateMovieModal, setShowCreateMovieModal ] = useState<boolean>(false);
  const [ movieDetailsEditState, setMovieDetailsEditState ] = useState<boolean>(true);

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
        MovieDataService.movieDataFetch()
          .then(function(myJson) {
            setMovieCatalog(myJson);
            setMovieCatalogSearch(myJson);
          });
        break;
    }

  };

  const dismissMovieDetailsModal = () => {
    modalMovieDetails.current?.dismiss();
    setFetchCall(!fetchCall);
    onMovieDetailsModalDismiss();
  }

  const dismissCreateMovieModal = () => {
    modalCreateMovie.current?.dismiss();
    setFetchCall(!fetchCall);
    setShowCreateMovieModal(false);
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
    const fetchData = async () => {
      await MovieDataService.movieDataFetch()
        .then(function(myJson) {
          setMovieCatalogSearch(myJson);
          
          switch (sortValue) {
            case 'up':
              setMovieCatalog(myJson.sort((a: any,b: any) => a.name > b.name ? 1 : -1));
              break;
            case 'down':
              setMovieCatalog(myJson.sort((a: any,b: any) => a.name < b.name ? 1 : -1));
              break;
            default:
              setMovieCatalog(myJson);
              break;
          }
        });      
    }

    fetchData().catch(console.error);    
  },[ fetchCall ]);

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
            <IonButtons slot='end'>
              <IonButton
                fill="solid"
                color='primary'
                onClick={() => setShowCreateMovieModal(true)}
              >
                <IonIcon slot='start' icon={add}></IonIcon>
                New Movie
              </IonButton>
            </IonButtons>         
          </IonItem>   
        </IonHeader>

        <IonModal onDidDismiss={onMovieDetailsModalDismiss} isOpen={showMovieDetailsModal} id="movie-modal" ref={modalMovieDetails}>
          <SelectedMovieDetails 
            selectedMovie={ movieCatalog.filter((obj: any) => {return obj.id === showMovieDetailState})[0] } 
            dismissMovieDetailsModal={dismissMovieDetailsModal} 
            movieDetailsEditState={movieDetailsEditState}
            setMovieDetailsEditState={setMovieDetailsEditState}
          ></SelectedMovieDetails>
        </IonModal>
        
        <IonModal backdropDismiss={false} id="create-modal" isOpen={showCreateMovieModal} ref={modalCreateMovie}>
          <CreateNewMovie
            dismissCreateMovieModal={dismissCreateMovieModal}            
          ></CreateNewMovie>
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
