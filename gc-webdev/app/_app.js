import '../styles/globals.css';
import StoreContextProvider from '../context/storeContext';
import MainLayout from '../components/MainLayout';

function MyApp({ Component, pageProps }) {
  return (
    <StoreContextProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </StoreContextProvider>
  );
}

export default MyApp;