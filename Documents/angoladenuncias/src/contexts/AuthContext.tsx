import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isEditor: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  isEditor: false,
  loading: true,
  signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkRoles = async (userId: string) => {
    console.log("[Auth] Checking roles for:", userId);
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        console.error("[Auth] Role check error:", error);
        return;
      }

      if (data && data.length > 0) {
        const admin = data.some((r) => r.role === "admin");
        const editor = data.some((r) => r.role === "editor" || r.role === "admin");
        console.log("[Auth] Roles updated:", { admin, editor });
        setIsAdmin(admin);
        setIsEditor(editor);
      } else {
        console.log("[Auth] No roles found for user");
        setIsAdmin(false);
        setIsEditor(false);
      }
    } catch (err) {
      console.error("[Auth] Unexpected role check failure:", err);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      console.log("[Auth] Initializing session...");
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session) {
          console.log("[Auth] Session found, checking roles...");
          setSession(session);
          setUser(session.user);
          await checkRoles(session.user.id);
        } else {
          console.log("[Auth] No active session");
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsEditor(false);
        }
      } catch (err) {
        console.error("[Auth] Initialization failed:", err);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log("[Auth] Initialization complete");
        }
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("[Auth] State changed:", event);

        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await checkRoles(newSession.user.id);
        } else {
          setIsAdmin(false);
          setIsEditor(false);
        }

        // Ensure loading is false after any state change if it wasn't already
        setLoading(false);
      }
    );

    // Safety timeout: Never stay stuck in loading more than 5 seconds
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("[Auth] Safety timeout reached, forcing loading to false");
        setLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const signOut = async () => {
    console.log("[Auth] Signing out...");
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setIsEditor(false);
      setSession(null);
      setUser(null);
    } catch (err) {
      console.error("[Auth] Sign out failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isEditor, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
