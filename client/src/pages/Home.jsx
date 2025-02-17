import { useRef } from 'react';
import Navbar from '../components/NavBar';
import Landing from '../components/Landing';
import Campaigns from '../components/Campaigns';
import AboutUs from '../components/AboutUs';
import ContactUs from '../components/ContactUs';

const Home = () => {
 
  const aboutUsRef = useRef(null);    
  const contactUsRef = useRef(null);
  const homeRef = useRef(null);
  return (
    <>
      <Navbar homeRef={homeRef}  aboutUsRef={aboutUsRef} contactUsRef={contactUsRef} /> 
      <div ref={homeRef}>
      <Landing />
      </div>
      
      <div ref={aboutUsRef}>
        <AboutUs />
      </div>
      <div ref={contactUsRef}>
        <ContactUs />
      </div>
    </>
  );
};

export default Home;