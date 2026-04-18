import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Tag,
    Settings,
    Package,
    ChevronLeft,
    Home,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    const { signOut } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        { icon: Users, label: "Usuários", href: "/admin/usuarios" },
        { icon: Package, label: "Anúncios", href: "/admin/anuncios" },
        { icon: Tag, label: "Categorias", href: "/admin/categorias" },
        { icon: Settings, label: "Configurações", href: "/admin/configuracoes" },
    ];

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-card hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                        <span className="font-bold text-xl tracking-tight hidden lg:inline">Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                location.pathname === item.href
                                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t space-y-2">
                    <Link to="/">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                            <Home className="h-5 w-5" />
                            <span>Voltar ao Site</span>
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={signOut}
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Sair</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 border-b bg-card flex items-center px-6 md:px-8 justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-semibold">
                            {menuItems.find(item => item.href === location.pathname)?.label || "Admin"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-right hidden sm:block">
                            <p className="font-medium">Administrador</p>
                            <p className="text-muted-foreground text-xs">Gestão Total</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            A
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
