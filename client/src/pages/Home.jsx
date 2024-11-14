import { useRef } from 'react';
import Navbar from '../components/NavBar';
import Landing from '../components/Landing';
import Campaigns from '../components/Campaigns';
import AboutUs from '../components/AboutUs';
import ContactUs from '../components/ContactUs';

const Home = () => {
 
  const aboutUsRef = useRef(null);    // Ref for the About Us section
  const contactUsRef = useRef(null);  // Ref for the Contact Us section
  const homeRef = useRef(null);
  return (
    <>
      <Navbar homeRef={homeRef}  aboutUsRef={aboutUsRef} contactUsRef={contactUsRef} /> {/* Pass refs to Navbar */}
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