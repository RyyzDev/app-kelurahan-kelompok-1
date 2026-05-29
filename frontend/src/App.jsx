import { Provider } from 'react-redux';
import { store } from './store';
import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
      <Toaster position="top-right" reverseOrder={false} />
    </Provider>
  );
}

export default App;
