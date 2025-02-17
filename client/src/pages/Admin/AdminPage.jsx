import React, { useState } from 'react';
import handleLogOut from '@/components/handleLogOut';
import AdminUpload from './AdminUpload'; 

const AdminPage = () => {
 
  return (
    <div>
      <div
        className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex items-center justify-between px-6 py-2"
        style={{ height: '50px' }}
      >
        <div className=" text-purple-800 text-xl font-bold flex-shrink-0">
          Admin
        </div>
        <div className="ml-auto flex gap-4">
          <AdminUpload/>
          <button
            onClick={handleLogOut}
            className="text-sm text-purple-600 font-semibold py-2 px-4 rounded-md hover:bg-purple-200"
          >
            Logout
          </button>
        </div>
      </div>

     
    </div>
  );
};

export default AdminPage;
