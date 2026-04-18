import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Globe, Shield, Zap } from "lucide-react";

const AdminSettings = () => {
    const handleSave = () => {
        toast.success("Configurações salvas com sucesso!");
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl space-y-8">
                <Tabs defaultValue="geral" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="geral" className="gap-2">
                            <Globe className="h-4 w-4" />
                            Geral
                        </TabsTrigger>
                        <TabsTrigger value="seguranca" className="gap-2">
                            <Shield className="h-4 w-4" />
                            Segurança
                        </TabsTrigger>
                        <TabsTrigger value="performance" className="gap-2">
                            <Zap className="h-4 w-4" />
                            Performance
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="geral" className="space-y-6">
                        <div className="bg-card border rounded-xl p-6 space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg">Preferências do Site</h3>
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="site-name">Nome do Site</Label>
                                        <Input id="site-name" defaultValue="Mercado PayPay" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="support-email">Email de Suporte</Label>
                                        <Input id="support-email" defaultValue="suporte@mercadopaypay.com" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-bold text-lg">Funcionalidades</h3>
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                    <div className="space-y-1">
                                        <Label className="text-base">Aprovação Automática</Label>
                                        <p className="text-sm text-muted-foreground">Aprovar novos anúncios automaticamente sem moderação.</p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                    <div className="space-y-1">
                                        <Label className="text-base">Chat Interno</Label>
                                        <p className="text-sm text-muted-foreground">Habilitar sistema de mensagens entre compradores e vendedores.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="seguranca" className="space-y-6">
                        <div className="bg-card border rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-6">Políticas de Segurança</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-base">Verificação de Email</Label>
                                        <p className="text-sm text-muted-foreground">Exigir que usuários confirmem o email antes de anunciar.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-base">Autenticação de Dois Fatores (2FA)</Label>
                                        <p className="text-sm text-muted-foreground">Habilitar 2FA para contas administrativas.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-6">
                        <div className="bg-card border rounded-xl p-6 space-y-6">
                            <h3 className="font-bold text-lg">Otimização</h3>
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="carousel-speed">Velocidade do Carrossel (ms)</Label>
                                    <Input id="carousel-speed" type="number" defaultValue="5000" />
                                    <p className="text-xs text-muted-foreground">Tempo de transição entre os banners principais.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cache-ttl">Tempo de Cache (segundos)</Label>
                                    <Input id="cache-ttl" type="number" defaultValue="3600" />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-4">
                    <Button variant="outline">Cancelar</Button>
                    <Button className="gap-2" onClick={handleSave}>
                        <Save className="h-4 w-4" />
                        Salvar Alterações
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
