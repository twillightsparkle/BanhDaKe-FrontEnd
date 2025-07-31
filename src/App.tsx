import './App.css'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import Navbar from './components/Navbar';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App
