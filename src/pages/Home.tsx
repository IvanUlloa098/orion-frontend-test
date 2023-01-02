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

/**
 * The home page contains all the different components of the movie catalog, details and creation. 
 * Basic navigation logic that determines the context in which each component is displayed.
 * Data fetching from the API is also managed in this main component.
 */

const Home: React.FC = () => {
  // References declaration for modals (details and create movie)
  const modalMovieDetails = useRef<HTMLIonModalElement>(null);
  const modalCreateMovie = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);
  
  // States declarations mainly used for navigation purposes
  const [ movieCatalog, setMovieCatalog ] = useState<any>();
  const [ fetchCall, setFetchCall ] = useState<boolean>(true); // Used for updating data when the value changes
  const [ movieCatalogSearch, setMovieCatalogSearch ] = useState<any>();
  const [ searchValue, setSearchValue ] = useState<string>('');
  const [ sortValue, setSortValue ] = useState<'all' | 'up' | 'down' | 'genre' | 'favorites'>('all'); // Includes all the sorting types available
  const [ showMovieDetailState, setShowMovieDetailState ] = useState<number>(-1);
  const [ showMovieDetailsModal, setShowMovieDetailsModal ] = useState<boolean>(false);
  const [ showCreateMovieModal, setShowCreateMovieModal ] = useState<boolean>(false);
  const [ movieDetailsEditState, setMovieDetailsEditState ] = useState<boolean>(true);

  // Method used for filtering data if the search value from the search bar changes
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

  // Method used for sorting movies rearranging the order of the fetched data (alphabetically, favorites, genres)  
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
        // In case of not bein specified the data is fetched again 
        MovieDataService.movieDataFetch()
          .then(function(myJson) {
            setMovieCatalog(myJson);
            setMovieCatalogSearch(myJson);
          });
        break;
    }

  };

  // Method used to dimiss the movie details modal. Updates the data and calls onMovieDetailsModalDismiss
  const dismissMovieDetailsModal = () => {
    modalMovieDetails.current?.dismiss();
    setFetchCall(!fetchCall);
    onMovieDetailsModalDismiss();
  }

  // Method used to dimiss the create movie modal. Updates the data and closes modal
  const dismissCreateMovieModal = () => {
    modalCreateMovie.current?.dismiss();
    setFetchCall(!fetchCall);
    setShowCreateMovieModal(false);
  }

  // Method called by dismissMovieDetailsModal to refresh the states needed for a different modal to pop up 
  const onMovieDetailsModalDismiss = () => {
    setShowMovieDetailState(-1);
    setMovieDetailsEditState(true);
    setShowMovieDetailsModal(false);
  }

  // This hook fetches the data from the API and will set the default movie catalog as well as a copy of it for filtering purposes
  useEffect(()=>{
    const searchValueCopy = searchValue;
    const fetchData = async () => {
      await MovieDataService.movieDataFetch()
        .then(function(myJson) {
          !searchValue?setMovieCatalogSearch(myJson):setMovieCatalogSearch(movieCatalogSearch); // Check if data is being searched

          // Check for the sorting mecanism selected the last time the catalog was fetched
          switch (sortValue) {
            case 'up':
              setMovieCatalog(myJson.sort((a: any,b: any) => a.name > b.name ? 1 : -1));
              break;
            case 'down':
              setMovieCatalog(myJson.sort((a: any,b: any) => a.name < b.name ? 1 : -1));
              break;
            case 'favorites':
              setMovieCatalog(myJson.filter((obj: any) => {return obj.favorite === true}));
              break;
            default:
              setMovieCatalog(myJson);
              break;
          }          
        });      
    }

    fetchData().catch(console.error);    
  },[ fetchCall ]);
  
  // All the hooks ahead will check if the movie catalog has been fetched
  // Check the change of the search values to begin filtering the data
  useEffect(()=>{
    if (movieCatalog) 
      searchMovieCatalog(movieCatalog.slice(), searchValue);
  }, [ searchValue ] );
   
  // Check for the sort values to begin sorting the movie data according to the selection
  useEffect(() => {
    if (movieCatalog)
      sortMovieCatalog(movieCatalog.slice(), sortValue);
  }, [ sortValue ] );

  // Check for a movie to be clicked so the movie details modal can pop up. Checks if the movie id is a valid one
  useEffect(() => {
    if (showMovieDetailState >= 0){
      setShowMovieDetailsModal(true);
    }
  }, [ showMovieDetailState ] );

  return (
    <IonPage ref={page}>
      
      <IonHeader mode='md'>
        <ToolBar searchValue={searchValue} setSearchValue={setSearchValue} sortValue={sortValue} setSortValue={setSortValue} />  
      </IonHeader>

      {/** Check if the movie catalog has been fetched from the API */}
      {movieCatalog && movieCatalog.length>0 && <IonContent fullscreen>
        <IonHeader mode='md'>
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

        {/** Movie details and create new movie modals (hidden by default) */}
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

        {/** Components that display the sorted and filteres data according to the inputs given */}
        {(sortValue !== 'genre' &&
          sortValue !== 'favorites' &&
         !searchValue)  && ( 
          <IonGrid className='ion-padding-end' fixed={true} >
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
