import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import Campaigns from "./pages/Campaigns";
import Ownerinfo from "./components/OwnerInfo";
import CreateCampaign from "./components/CreateCampaign";
import CampaignDetails from "./components/CampaignDetails";


const routes = (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/create-campaign" exact element = {<CreateCampaign/>}/>
      <Route path="/home" exact element={<Home />} />
      <Route path="/campaigns" exact element={<Campaigns />} />
      <Route path="/ownerinfo" exact element={<Ownerinfo />} />
      <Route path="/campaigndetails" exact element={<CampaignDetails />} />
    </Routes>
  </Router>
);

const App = () => {
  return (
    <div>{routes}</div>
  );
};

export default App;