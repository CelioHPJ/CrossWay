import { MessageCircle } from "lucide-react";
import { Button } from "./button";

export function WhatsAppFloat() {
    const handleWhatsAppClick = () => {
        const phoneNumber = "5537998285821";
        const message =
            "Olá! Gostaria de mais informações sobre os produtos da Crest Clothing.";

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    return (
        <Button
            onClick={handleWhatsAppClick}
            size="lg"
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            title="Falar no WhatsApp"
        >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Button>
    );
}
