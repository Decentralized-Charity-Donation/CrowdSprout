
import {BrowserRouter as Router,Routes,Route}from "react-router-dom"
import './App.css'
import Home from './pages/Home/Home'
import Campaigns from "./pages/Campaigns/Campaigns"
import OwnerLogin from "./pages/OwnerSignUp/OwnerSignUp"
import UserSignUp from "./pages/UserSignUp/UserSignUp"

const routes=(
  <Router>
  <Routes>
  <Route path="/home" exact element={<Home />}/>
  <Route path="/campaigns" exact element={<Campaigns />} />
  <Route path="/ownerLogin" exact element={<OwnerLogin/>} />
  <Route path="/userSignUp" exact element={<UserSignUp />} />

  </Routes>
  </Router>
);

const App = () => {
  return (
   <div>{routes}</div>
  )
}

export default App
