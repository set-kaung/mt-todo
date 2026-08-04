import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { PlannerProvider } from './context/PlannerContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <PlannerProvider>
    <App />
  </PlannerProvider>
);
