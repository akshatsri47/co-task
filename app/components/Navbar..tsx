"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/client"; // Adjust path as needed
import { LogIn, LogOut, User, LoaderCircle } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Check for user session on load
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null);
      });
      
      return () => subscription.unsubscribe();
    };
    
    getUser();
  }, [supabase.auth]);

  // Sign-in function
  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        },
      });
    } catch (error) {
      console.error("Error signing in:", error);
      setIsLoading(false);
    }
  };

  // Sign-out function
  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4" style={{ 
      background: 'linear-gradient(to right, #F1CEC7, #7A94DD)'
    }}>
      <div className="flex items-center space-x-12">
        <a href="#" className="text-white font-medium">FEATURES</a>
        <a href="#" className="text-white font-medium">ABOUT</a>
        <h1 className="text-xl font-bold text-white mx-6">Co-Task</h1>
      </div>
      
      <div>
        {user ? (
          <Button 
            variant="ghost" 
            className="text-white font-medium hover:bg-white hover:bg-opacity-20"
            onClick={signOut}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 size-4" />
            )}
            Sign Out
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            className="text-white font-medium hover:bg-white hover:bg-opacity-20"
            onClick={signInWithGoogle}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 size-4" />
            )}
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;