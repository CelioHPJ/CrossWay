import React, { useState, useEffect } from "react";
import {
    User,
    Phone,
    Lock,
    Home,
    Settings,
    ChevronLeft,
    ShoppingBag,
    Heart,
    Crown,
    Menu,
    ChevronRight,
    LogOut,
} from "lucide-react";
import { Button } from "../atoms/button.jsx";
// Import atualizado para incluir Title, Description e Header
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "../atoms/sheet.jsx";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose,
} from "../atoms/dialog.jsx";
import { Input } from "../atoms/Input.jsx";
import { Label } from "../atoms/label.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router";
import { OrderSummary } from "../organisms/OrderSummary.jsx";
import { supabase } from "../../../utils/supabase/client";
import { ordersApi } from "../../services/api.js";

// ... (Mantenha os componentes OrdersSection e RenderMainContent como estão, sem alterações) ...
// Para brevidade, vou focar apenas na alteração dentro do componente principal UserProfilePage

// ==========================================
// 1. COMPONENTE: OrdersSection (Sem alterações)
// ==========================================
function OrdersSection({ onBack }) {
    // ... (mesmo código original) ...
    const { user } = useAuth();
    const [myOrders, setMyOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) {
                setMyOrders([]);
                setLoadingOrders(false);
                return;
            }
            try {
                const data = await ordersApi.getUserOrders(user.id);
                setMyOrders(data);
            } catch (error) {
                console.error("Erro ao buscar pedidos", error);
                toast.error("Não foi possível carregar seus pedidos.");
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, [user?.id]);

    const getStatusColor = (status) => {
        const map = {
            PENDING: "bg-yellow-100 text-yellow-800",
            PAID: "bg-blue-100 text-blue-800",
            PROCESSING: "bg-blue-100 text-blue-800",
            SHIPPED: "bg-purple-100 text-purple-800",
            DELIVERED: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800",
        };
        return map[status] || "bg-gray-100";
    };

    const translateStatus = (status) => {
        const map = {
            PENDING: "Aguardando Pagamento",
            PAID: "Pago",
            PROCESSING: "Em Separação",
            SHIPPED: "Em Trânsito",
            DELIVERED: "Entregue",
            CANCELLED: "Cancelado",
        };
        return map[status] || status;
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button
                onClick={onBack}
                className="flex items-center text-primary hover:underline mb-6 font-medium text-sm"
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                voltar
            </button>
            <h2 className="text-2xl font-bold mb-6">Meus Pedidos</h2>

            {loadingOrders ? (
                <div className="flex justify-center py-10">
                    <p className="text-muted-foreground animate-pulse">
                        Carregando pedidos...
                    </p>
                </div>
            ) : myOrders.length === 0 ? (
                <div className="text-center py-10 border rounded-lg bg-gray-50">
                    <p className="text-muted-foreground">
                        Você ainda não fez nenhum pedido.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {myOrders.map((order) => (
                        <div
                            key={order.orderId}
                            className="border rounded-lg p-4 hover:border-primary transition-colors bg-white shadow-sm"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                                <div>
                                    <p className="font-bold text-lg">
                                        Pedido #{order.orderId}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(
                                            order.orderedAt
                                        ).toLocaleDateString()}{" "}
                                        às{" "}
                                        {new Date(
                                            order.orderedAt
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}
                                >
                                    {translateStatus(order.status)}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4 bg-muted/20 p-3 rounded-md">
                                {order.items?.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="text-foreground/80">
                                            {item.quantity}x{" "}
                                            {item.product?.name || "Produto"}
                                        </span>
                                        <span className="font-medium text-foreground">
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(
                                                Number(item.paidUnitPrice)
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-3 flex justify-between items-center">
                                <span className="font-semibold text-muted-foreground">
                                    Total
                                </span>
                                <span className="font-bold text-lg text-primary">
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(Number(order.totalAmount))}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ==========================================
// 2. RenderMainContent (Sem alterações)
// ==========================================
const RenderMainContent = ({
    activeSection,
    setActiveSection,
    profileCards,
    user,
    onEdit,
}) => {
    const BackButton = () => (
        <button
            onClick={() => setActiveSection("profile")}
            className="flex items-center text-primary hover:underline mb-6 font-medium text-sm"
        >
            <ChevronLeft className="h-4 w-4 mr-1" />
            voltar
        </button>
    );

    switch (activeSection) {
        case "personal-data":
            return (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <BackButton />
                    <h2 className="text-2xl font-bold mb-8">Dados Pessoais</h2>
                    <div className="space-y-1">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b">
                            <div className="w-full md:w-1/4 mb-2 md:mb-0">
                                <span className="font-bold text-foreground">
                                    Nome
                                </span>
                            </div>
                            <div className="flex-1 text-muted-foreground uppercase">
                                {user?.name || "NOME NÃO INFORMADO"}
                            </div>
                            <button
                                onClick={() =>
                                    onEdit("name", "Nome Completo", user?.name)
                                }
                                className="text-primary font-bold text-sm hover:underline mt-2 md:mt-0 cursor-pointer"
                            >
                                editar
                            </button>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b">
                            <div className="w-full md:w-1/4 mb-2 md:mb-0">
                                <span className="font-bold text-foreground">
                                    CPF
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-muted-foreground">
                                    136.***.***-76
                                </p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                    Este dado não pode ser alterado
                                </p>
                            </div>
                            <button className="text-primary font-bold text-sm hover:underline mt-2 md:mt-0 cursor-pointer">
                                mostrar
                            </button>
                        </div>
                    </div>
                </div>
            );

        case "contacts":
            return (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <BackButton />
                    <h2 className="text-2xl font-bold mb-8">Contatos</h2>
                    <div className="space-y-1">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b">
                            <div className="w-full md:w-1/4 mb-2 md:mb-0">
                                <span className="font-bold text-foreground">
                                    e-mail
                                </span>
                            </div>
                            <div className="flex-1 text-muted-foreground">
                                {user?.email || "email@exemplo.com"}
                            </div>
                            <button
                                onClick={() =>
                                    onEdit("email", "E-mail", user?.email)
                                }
                                className="text-primary font-bold text-sm hover:underline mt-2 md:mt-0 cursor-pointer"
                            >
                                editar
                            </button>
                        </div>
                    </div>
                </div>
            );

        case "access-data":
            return (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <BackButton />
                    <h2 className="text-2xl font-bold mb-4">Dados de acesso</h2>
                    <p className="text-muted-foreground mb-8">
                        Mantenha sua senha sempre atualizada.
                    </p>
                    <Button className="w-full md:w-auto px-8 py-6 text-lg rounded-md font-bold shadow-sm">
                        Alterar Senha
                    </Button>
                </div>
            );

        case "addresses":
            return (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <BackButton />
                    <h2 className="text-2xl font-bold mb-8">Endereços</h2>
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="mb-6 bg-muted/30 rounded-full p-8">
                            <Home
                                className="w-24 h-24 text-muted-foreground/50"
                                strokeWidth={1}
                            />
                        </div>
                        <p className="text-primary font-bold mb-8 text-lg">
                            Sem endereço cadastrado
                        </p>
                        <Button className="px-6 py-6 font-bold rounded-md">
                            Adicionar novo endereço
                        </Button>
                    </div>
                </div>
            );

        case "orders":
            return <OrdersSection onBack={() => setActiveSection("profile")} />;

        case "favorites":
            return (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <BackButton />
                    <h2 className="text-2xl font-bold mb-8">Favoritos</h2>
                    <p>Aqui você verá seus produtos favoritados.</p>
                </div>
            );

        case "preferences":
            return (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <BackButton />
                    <h2 className="text-2xl font-bold mb-8">Preferências</h2>
                    <p className="text-muted-foreground">
                        Gerencie suas preferências de notificação.
                    </p>
                </div>
            );

        case "profile":
        default:
            return (
                <>
                    <h2 className="text-2xl font-bold mb-8">Meu Perfil</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {profileCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={card.id}
                                    onClick={() => setActiveSection(card.id)}
                                    className="border-2 rounded-xl p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                                            <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-lg mb-1">
                                                {card.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {card.description}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            );
    }
};

// ==========================================
// 3. UserProfilePage (Alterado)
// ==========================================
export function UserPage({ onBack }) {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Inicializa o estado com base na URL
    const urlSection = searchParams.get("section") || "profile";
    const [activeSection, setActiveSection] = useState(urlSection);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingField, setEditingField] = useState({
        key: "",
        label: "",
        value: "",
    });
    const [tempValue, setTempValue] = useState("");

    // Sincroniza mudança de URL com o estado do componente
    useEffect(() => {
        const sectionFromUrl = searchParams.get("section") || "profile";
        setActiveSection(sectionFromUrl);
    }, [searchParams]);

    const handleNavigation = (sectionId) => {
        setActiveSection(sectionId);
        setSearchParams({ section: sectionId });
        setIsMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                throw error;
            }
            toast.success("Você saiu com sucesso!");
            navigate("/");
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            toast.error("Erro ao tentar sair.");
        }
    };

    const handleEditClick = (key, label, currentValue) => {
        setEditingField({ key, label, value: currentValue || "" });
        setTempValue(currentValue || "");
        setIsEditModalOpen(true);
    };

    const handleSave = async () => {
        console.log(`Salvando ${editingField.key}: ${tempValue}`);
        toast.success(`${editingField.label} atualizado com sucesso!`);
        setIsEditModalOpen(false);
    };

    const menuItems = [
        { id: "profile", label: "Meu Perfil", icon: User },
        { id: "orders", label: "Meus Pedidos", icon: ShoppingBag },
        { id: "favorites", label: "Favoritos", icon: Heart },
    ];

    const profileCards = [
        {
            id: "personal-data",
            title: "Dados Pessoais",
            description: "Gerencie seus dados pessoais.",
            icon: User,
        },
        {
            id: "contacts",
            title: "Contatos",
            description: "Gerencie e-mails e telefones.",
            icon: Phone,
        },
        {
            id: "access-data",
            title: "Dados de Acesso",
            description: "Troque sua senha.",
            icon: Lock,
        },
        {
            id: "addresses",
            title: "Endereços",
            description: "Altere endereços de entregas.",
            icon: Home,
        },
        {
            id: "preferences",
            title: "Preferências",
            description: "Confira suas preferências.",
            icon: Settings,
        },
    ];

    const renderSidebarContent = (isMobile = false) => {
        const currentActiveSection = activeSection;
        return (
            <div className="h-full flex flex-col">
                <div
                    className={`flex flex-col items-start gap-4 mb-2 pb-6 border-b ${isMobile ? "p-4 pt-8" : "p-6 pt-8"}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center relative flex-shrink-0">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                {user?.name
                                    ? user.name.charAt(0).toUpperCase()
                                    : "C"}
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-lg line-clamp-1">
                                {user?.name || "CLIENTE"}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <span className="font-bold text-primary">
                                    0
                                </span>{" "}
                                pts
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 flex-1">
                    <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-4 px-3">
                        Minha Conta
                    </h3>
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive =
                                currentActiveSection === item.id ||
                                (currentActiveSection !== "orders" &&
                                    currentActiveSection !== "favorites" &&
                                    item.id === "profile");
                            return (
                                <div key={item.id}>
                                    <button
                                        onClick={() =>
                                            handleNavigation(item.id)
                                        }
                                        className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-foreground hover:bg-muted"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="h-4 w-4" />
                                            <span className="text-sm font-medium">
                                                {item.label}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-6 border-t mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm font-medium">Sair</span>
                        </div>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 bg-muted/20 pb-10">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="h-10 w-10 p-0 shrink-0"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                                <Crown className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <h1 className="font-bold text-primary truncate">
                                Minha Conta
                            </h1>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="h-10 w-10 p-0 shrink-0"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row gap-6 md:gap-6">
                    <aside className="w-full md:w-72 md:flex-shrink-0 hidden md:block bg-white rounded-2xl shadow-sm border h-fit sticky top-24">
                        {renderSidebarContent(false)}
                    </aside>

                    <Sheet
                        open={isMobileMenuOpen}
                        onOpenChange={setIsMobileMenuOpen}
                    >
                        <SheetContent side="left" className="p-0 w-72 pt-0">
                            {/* Adicionado Header com classe sr-only para acessibilidade */}
                            <SheetHeader className="sr-only">
                                <SheetTitle>Menu de Perfil</SheetTitle>
                                <SheetDescription>
                                    Navegação para opções da conta do usuário
                                </SheetDescription>
                            </SheetHeader>
                            {renderSidebarContent(true)}
                        </SheetContent>
                    </Sheet>

                    <main className="flex-1 w-full min-w-0">
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border">
                            <RenderMainContent
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                                profileCards={profileCards}
                                user={user}
                                onEdit={handleEditClick}
                            />
                        </div>
                    </main>
                </div>
            </div>

            {/* MODAL DE EDIÇÃO */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar {editingField.label}</DialogTitle>
                        <DialogDescription>
                            Faça as alterações necessárias e clique em salvar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid w-full gap-2">
                            <Label htmlFor="edit-input">
                                {editingField.label}
                            </Label>
                            <Input
                                id="edit-input"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                placeholder={`Digite seu novo ${editingField.label.toLowerCase()}`}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSave}>
                            Salvar alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
