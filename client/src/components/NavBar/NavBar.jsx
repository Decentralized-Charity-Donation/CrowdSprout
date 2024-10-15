import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='flex items-center justify-between px-6 py-2 bg-white shadow-md'>
      {/* Logo Section */}
      <div className='text-xl font-bold'>
        <Link to="/home">
          Logo
        </Link>
      </div>

      {/* Middle Links */}
      <div className='flex space-x-8'>
        <Link to="/home" className="font-medium hover:text-purple-500 hover:scale-105 transition-transform duration-300 ease-in-out">
          Home
        </Link>
        <Link to="/aboutus" className="font-medium hover:text-purple-500 hover:scale-105 transition-transform duration-300 ease-in-out">
          About Us
        </Link>
        <Link to="/contactus" className="font-medium hover:text-purple-500 hover:scale-105 transition-transform duration-300 ease-in-out">
          Contact Us
        </Link>
      </div>

      {/* Connect Wallet Button */}
      <div className='flex items-center'>
        <button className='bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600'>
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default Navbar;
