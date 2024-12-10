import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import './App.css';
import Home from './pages/Home';
// import Campaigns from "./pages/Campaigns";
import Ownerinfo from "./components/OwnerInfo";
import CreateCampaign from "./components/CreateCampaign";
// import CampaignDetails from "./components/CampaignDetails";
import AllCampaigns from "./pages/Contributor/AllCampaigns";
import OwnerCampaigns from "./pages/Owner/OwnerCampaigns";
import FundCampaign from "./pages/Contributor/FundCampaign";
import ViewCampaign from "./pages/Owner/ViewCampaign";
import AdminPage from "./pages/AdminPage";

const routes = (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/create-campaign" exact element = {<CreateCampaign/>}/>
      <Route path="/home" exact element={<Home />} />
      {/* <Route path="/campaigns" exact element={<Campaigns />} /> */}
      <Route path="/ownerinfo" exact element={<Ownerinfo />} />
      {/* <Route path="/campaigndetails" exact element={<CampaignDetails />} /> */}
      <Route path="/allcampaigns" exact element={<AllCampaigns />} />
      <Route path="/ownercampaigns" exact element={<OwnerCampaigns />} />
      <Route path="/viewcampaign/:id" exact element={<ViewCampaign />} />
      <Route path="/fundcampaign/:id" exact element={<FundCampaign />} />
      <Route path="/adminPage" exact element={<AdminPage />} />
      
    </Routes>
  </Router>
);

const App = () => {
  return (
    <div>{routes}</div>
  );
};

export default App;