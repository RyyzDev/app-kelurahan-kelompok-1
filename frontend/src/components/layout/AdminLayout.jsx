import React from 'react';
import AdminSidebar from '../admin/AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
