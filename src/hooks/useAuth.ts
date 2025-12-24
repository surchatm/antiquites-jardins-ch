import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Whitelist of allowed admin emails
const ALLOWED_ADMIN_EMAILS = [
  "laurent.music@gmail.com", // Your dad
  // Add your email here when needed
];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if user email is in whitelist
        if (session?.user) {
          const userEmail = session.user.email?.toLowerCase();
          const isAllowed = userEmail && ALLOWED_ADMIN_EMAILS.some(
            email => email.toLowerCase() === userEmail
          );
          setIsAdmin(isAllowed ?? false);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const userEmail = session.user.email?.toLowerCase();
        const isAllowed = userEmail && ALLOWED_ADMIN_EMAILS.some(
          email => email.toLowerCase() === userEmail
        );
        setIsAdmin(isAllowed ?? false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    signInWithGoogle,
    signOut,
    allowedEmails: ALLOWED_ADMIN_EMAILS,
  };
};
