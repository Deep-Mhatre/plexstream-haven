
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="w-full max-w-md bg-background border border-border rounded-xl shadow-lg p-8 fade-in">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground">
              Join PLEXSTREAM to start streaming
            </p>
          </div>
          
          <AuthForm mode="register" />
          
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              By creating an account, you agree to the{' '}
              <a href="#" className="text-accent hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-accent hover:underline">
                Privacy Policy
              </a>
              .
            </p>
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-accent hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
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

export default Register;
