
import React from 'react';
import Navbar from '@/components/Navbar';
import UserProfile from '@/components/UserProfile';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;
