import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ContractProvider } from './ContractContext/ContractContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContractProvider>
      
        <App />
      
    </ContractProvider>
  </StrictMode>
);
