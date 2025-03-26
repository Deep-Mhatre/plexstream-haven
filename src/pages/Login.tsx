
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="w-full max-w-md bg-background border border-border rounded-xl shadow-lg p-8 fade-in">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your PLEXSTREAM account
            </p>
          </div>
          
          <AuthForm mode="login" />
          
          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              New to PLEXSTREAM?{' '}
              <Link to="/register" className="text-accent hover:underline font-medium">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} PLEXSTREAM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
