import { Provider } from 'react-redux';
import { store } from './store';
import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';
import ConnectivityIndicator from './components/common/ConnectivityIndicator';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <ConnectivityIndicator />
      <AppRouter />
      <Toaster 
        position="bottom-center" 
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '100px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '12px 24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            style: {
              background: '#34A853',
            },
          },
          error: {
            style: {
              background: '#E53E3E',
            },
          },
        }}
      />
    </Provider>
  );
}

export default App;
