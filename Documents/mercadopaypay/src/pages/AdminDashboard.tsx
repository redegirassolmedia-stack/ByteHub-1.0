import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
    Users,
    Package,
    TrendingUp,
    DollarSign,
    Clock,
    CheckCircle2,
    Settings
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const AdminDashboard = () => {
    // Fetch stats
    const { data: stats, isLoading } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const [
                { count: usersCount },
                { count: listingsCount },
                { count: pendingCount },
                { data: recentListings }
            ] = await Promise.all([
                supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_admin", false),
                supabase.from("listings").select("*", { count: "exact", head: true }),
                supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "pending"),
                supabase.from("listings").select("*, profiles(display_name)").order("created_at", { ascending: false }).limit(5)
            ]);

            return {
                totalUsers: usersCount || 0,
                totalListings: listingsCount || 0,
                pendingApproval: pendingCount || 0,
                recentListings: recentListings || []
            };
        }
    });

    const cards = [
        { label: "Total de Usuários", value: stats?.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total de Anúncios", value: stats?.totalListings, icon: Package, color: "text-green-600", bg: "bg-green-50" },
        { label: "Aguardando Aprovação", value: stats?.pendingApproval, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Taxa de Conversão", value: "24%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, i) => (
                        <div key={i} className="bg-card p-6 rounded-xl border shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${card.bg} ${card.color} p-3 rounded-lg`}>
                                    <card.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                                <h3 className="text-2xl font-bold mt-1">
                                    {isLoading ? "..." : card.value}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Listings */}
                    <div className="lg:col-span-2 bg-card rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Anúncios Recentes
                            </h3>
                            <button className="text-sm text-primary font-medium hover:underline">Ver todos</button>
                        </div>
                        <div className="divide-y">
                            {isLoading ? (
                                <div className="p-12 text-center text-muted-foreground">Carregando dados...</div>
                            ) : stats?.recentListings.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground">Nenhum anúncio encontrado.</div>
                            ) : (
                                stats?.recentListings.map((listing: any) => (
                                    <div key={listing.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                                {listing.images?.[0] ? (
                                                    <img src={listing.images[0]} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <Package className="h-6 w-6 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm line-clamp-1">{listing.title}</p>
                                                <p className="text-xs text-muted-foreground">por {listing.profiles?.display_name || "Usuário"}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">
                                                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(listing.price)}
                                            </p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {listing.status === 'active' ? 'Ativo' : 'Pendente'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-card rounded-xl border shadow-sm p-6">
                        <h3 className="font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Ações Rápidas
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors text-left group">
                                <div className="bg-primary/10 text-primary p-2 rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Aprovar Anúncios</p>
                                    <p className="text-xs text-muted-foreground">{stats?.pendingApproval} pendentes</p>
                                </div>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors text-left group">
                                <div className="bg-blue-100 text-blue-600 p-2 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <DollarSign className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Ver Assinaturas</p>
                                    <p className="text-xs text-muted-foreground">Gerenciar planos premium</p>
                                </div>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors text-left group">
                                <div className="bg-purple-100 text-purple-600 p-2 rounded-md group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <Settings className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Configurar Site</p>
                                    <p className="text-xs text-muted-foreground">Velocidade, banners e SEO</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
