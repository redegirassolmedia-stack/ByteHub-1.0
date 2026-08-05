import { createContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { withTimeout } from "@/lib/utils";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isEditor: boolean;
  isAuthorizedForServices: boolean;
  allowedCategories: string[];
  allowedMenus: string[];
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  isEditor: false,
  isAuthorizedForServices: false,
  allowedCategories: [],
  allowedMenus: [],
  loading: true,
  signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isAuthorizedForServices, setIsAuthorizedForServices] = useState(false);
  const [allowedCategories, setAllowedCategories] = useState<string[]>([]);
  const [allowedMenus, setAllowedMenus] = useState<string[]>([]);
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
        setIsAdmin(false);
        setIsEditor(false);
        return;
      }

      if (data && data.length > 0) {
        const admin = data.some((r: any) => r.role === "admin");
        const editor = data.some((r: any) => r.role === "editor" || r.role === "admin");
        setIsAdmin(admin);
        setIsEditor(editor);

        // If editor but not admin, fetch restricted categories and menus
        if (editor && !admin) {
          const [{ data: catData }, { data: menuData }] = await Promise.all([
            supabase.from("editor_categories" as any).select("category").eq("user_id", userId),
            supabase.from("editor_menu_permissions" as any).select("menu_id").eq("user_id", userId)
          ]);

          setAllowedCategories(catData ? catData.map((c: any) => c.category) : []);
          setAllowedMenus(menuData ? menuData.map((m: any) => m.menu_id) : []);
        } else {
          setAllowedCategories([]);
          setAllowedMenus([]);
        }
      } else {
        setIsAdmin(false);
        setIsEditor(false);
        setAllowedCategories([]);
        setAllowedMenus([]);
      }

      // Check if user is authorized for "Our Services"
      // We check if the user is an admin OR if their email is in the authorized list
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.email) {
        if (isAdmin) { // Early check if we already know they are admin
          setIsAuthorizedForServices(true);
        } else {
          const { data: authorizedData } = await supabase
            .from("authorized_services_emails")
            .select("email")
            .eq("email", userData.user.email)
            .maybeSingle();

          setIsAuthorizedForServices(!!authorizedData || isAdmin);
        }
      } else {
        setIsAuthorizedForServices(false);
      }
    } catch (err) {
      console.error("[Auth] Unexpected role check failure:", err);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session) {
          setSession(session);
          setUser(session.user);
          await checkRoles(session.user.id);
        } else {
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
        }
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Defer role checking to avoid deadlocking the supabase-js internal fetch queue
          // during a TOKEN_REFRESH event that is blocking an ongoing query.
          setTimeout(() => {
            if (mounted) checkRoles(newSession.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsEditor(false);
        }

        setLoading(false);
      }
    );

    // Safety timeout: Never stay stuck in loading more than 10 seconds
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
      }
    }, 10000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("[Auth] Sign out call failed:", err);
    } finally {
      // Always clear local state to prevent UI lock
      setIsAdmin(false);
      setIsEditor(false);
      setSession(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      isEditor,
      isAuthorizedForServices,
      allowedCategories,
      allowedMenus,
      loading,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};
