import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; 
import App from './App.tsx';
import FunctionDefinitionPage from './Simulations/FunctionDefinitionPage';

const url = window.location.pathname;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {url === '/function-definition' ? <FunctionDefinitionPage /> : <App />}
    </StrictMode>
);