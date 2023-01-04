import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import ToggleButtons from './components/ToggleButtons';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <>
      <div>
        <Navbar />
        {/* <ToggleButtons /> */}
        <Dashboard />
      </div>
    </>
  );
}

export default App;
