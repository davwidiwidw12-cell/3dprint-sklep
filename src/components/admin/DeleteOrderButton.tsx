"use client";

import { deleteOrder } from "@/lib/orders";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function DeleteOrderButton({ orderId }: { orderId: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm("Czy na pewno chcesz usunąć to zamówienie? Tej operacji nie można cofnąć.")) {
            try {
                await deleteOrder(orderId);
                toast.success("Zamówienie usunięte");
                router.push("/admin/orders");
            } catch (error) {
                console.error(error);
                toast.error("Wystąpił błąd podczas usuwania");
            }
        }
    };

    return (
        <Button variant="destructive" onClick={handleDelete} className="gap-2">
            <Trash2 className="w-4 h-4" /> Usuń
        </Button>
    );
}
