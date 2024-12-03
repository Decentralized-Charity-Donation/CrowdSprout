
const handleLogOut = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
  
      localStorage.removeItem('userAddress'); 
     
      window.location.href = '/'; 
      alert('You have logged out successfully!');
    }
  };
  
  export default handleLogOut;
  