import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/navigation';
import Dashboard from './components/Dashboard';
import Dashboard2 from './components/Dashboard2';
import Dashboard3 from './components/Dashboard3';
import DetailedSummary from './components/DetailedSummary';
import { AppProvider } from './context/AppContext';
function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard1" element={<Dashboard />} />
          <Route path="/dashboard2" element={<Dashboard2 />} />
          <Route path="/dashboard3" element={<Dashboard3 />} />
          <Route path="detailed-summary" element={<DetailedSummary />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;