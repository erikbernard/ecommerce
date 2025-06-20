import { useEffect } from "react";
import { usePurchaseStore } from "../../store/Purchase";
import { StarRating } from "../StarRating";

export const PurchaseHistory = () => {
    const {
        state: { purchasedItems, isHistoryOpen },
        actions: { toggleHistory }
    } = usePurchaseStore();
    useEffect(() => {
        if (isHistoryOpen) usePurchaseStore.getState().actions.markPurchasesAsSeen()
    }, [isHistoryOpen]);

    if (!isHistoryOpen) return null;
    //TODO: componentizar o menu lateral melhoria animations, etc
    return (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={toggleHistory}>
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Histórico de Compras</h2>
                    <button onClick={toggleHistory} className="text-2xl">&times;</button>
                </header>
                <div className="flex-grow overflow-y-auto p-4">
                    {purchasedItems.length === 0 ? <p>Você ainda não comprou nada.</p> : [...purchasedItems].reverse().map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 p-4 border rounded-lg">
                            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                            <div className="flex-grow">
                                <p className="font-semibold text-lg">{item.name}</p>
                                <p className="text-sm text-gray-500">Comprado por R$ {item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex flex-col items-start sm:items-end gap-2">
                                <p className="text-sm text-gray-600">Sua avaliação:</p>
                                <StarRating productId={item.id} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

