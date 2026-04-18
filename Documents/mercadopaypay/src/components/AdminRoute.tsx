import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading: authLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("is_admin")
                    .eq("user_id", user.id)
                    .single();

                if (error) throw error;
                setIsAdmin(data?.is_admin || false);
            } catch (err) {
                console.error("Error checking admin status:", err);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            checkAdmin();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!user || !isAdmin) {
        if (!authLoading && !loading && user && isAdmin === false) {
            toast.error("Acesso negado: Você não tem permissões de administrador.");
        }
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
