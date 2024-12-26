
import BarberCard from './BarberCard';
import {BASE_URL} from './../../config';
import useFetchData from './../../hooks/useFetchData'
import Loader from '../../components/Loading/Loading.jsx'
import Error from '../../components/Error/Error.jsx';


const BarberList = () => {

  const {data:providers, loading, error} = useFetchData(`${BASE_URL}users/providers`)
  console.log('Providers data:', providers);
// console.log('Loading:', loading, 'Error:', error);


  return (
    
  <>
  
  {loading && <Loader />}
  {error && <Error />}
    {!loading && !error && 
    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] 
    lg:mt-[55px]'> {/* Grid container for the barber cards */}
      
      {/* Mapping through the barbers array and rendering a BarberCard for each barber */}
      {providers.map((provider) => (
        <BarberCard key={provider._id} provider={provider} />
))}

    </div>}
    
    </>
    
  );
  
};


export default BarberList