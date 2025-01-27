import { Routes, Route } from 'react-router-dom';
// import Navigation from './components/navigation/index';
import Home from './components/Home/index';
import Dashboard1 from './components/Dashboard/index';
import Dashboard2 from './components/Dashboard2/index';
import Feedback from './components/Feedback';
import FeedbackDetails from './components/Feedback/FeedbackDetails';
import Dashboard3 from './components/Dashboard3/index';
import Dashboard4 from './components/Dashboard4/index';
import DetailedSummary from './components/DetailedSummary/index';
import FeatureFeedbackPage from './components/Feedback/FeatureFeedbackPage';
import FeatureFeedbackDetails from './components/Feedback/FeatureFeedbackDetails';
import TopBar from './styles/TopBar';
import SignIn from './components/sign/SignIn';
import SignUp from './components/sign/SignUp';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './styles/AuthContext';



function AppRoutes() {
  const location = useLocation();



  
  // Define routes where TopBar should be hidden
  const hideTopBarRoutes = ['/signin', '/signup','/',''];
  const shouldShowTopBar = !hideTopBarRoutes.includes(location.pathname);
  return (
     
      <AuthProvider>
      {shouldShowTopBar && <TopBar />}
    
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />

        <Route path="/dashboard1" element={<Dashboard1 />} />
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/dashboard3" element={<Dashboard3 />} />
        <Route path="/dashboard4" element={<Dashboard4 />} />
        <Route path="/feedback/:model" element={<Feedback />} />
        <Route path="/feedback/details/:model/:index/:date" element={<FeedbackDetails />} />
        <Route path="/feature-feedback/:feature" element={<FeatureFeedbackPage />} />
      <Route path="/feature-feedback/details/:feature/:brand/:model" element={<FeatureFeedbackDetails />} />
        <Route path="/detailed-summary" element={<DetailedSummary />} /> {/* Updated path */}
        
      </Routes>
     
      </AuthProvider>

  );
}

export default AppRoutes;