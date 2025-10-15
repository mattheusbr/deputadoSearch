import { createRoot } from 'react-dom/client'
import ListaDeputados from './components/ListaDeputados';
import { CssBaseline } from '@mui/material'; // Ajuda a normalizar o estilo em diferentes navegadores


createRoot(document.getElementById('root')).render(
    <>
      <CssBaseline />
      <ListaDeputados />
    </>
)
