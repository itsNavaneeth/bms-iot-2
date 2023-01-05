import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import ToggleButtons from './components/ToggleButtons';
import Dashboard from './components/Dashboard';
import { Routes, Route } from 'react-router-dom';
import GraphBoard from "./components/GraphBoard";

function App() {
  return (
    <>
      <div>
        <Navbar />
        <Routes>
            
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="graphboard" element={<GraphBoard />} />
              <Route path="/" element={<Dashboard />}>  
              {/* Using path="*"" means "match anything", so this route
                    acts like a catch-all for URLs that we don't have explicit
                    routes for. */}
              <Route path="*" element={<h1>Error!</h1>} />
            </Route>
          </Routes>      
        {/* <ToggleButtons /> */}
        
      </div>
    </>
  );
}

export default App;
