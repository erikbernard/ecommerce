import { useCartStore } from "../../store/Cart";
import { useInteractionStore } from "../../store/Interaction";
import { usePurchaseStore } from "../../store/Purchase";

export const Header = () => {
    const toggleCart = useCartStore((state) => state.actions.toggleCart);
    const totalItems = useCartStore((state) => state.state.cartItems.reduce((total, item) => total + item.quantity, 0));
    const hasNewPurchases = usePurchaseStore(state => state.state.hasNewPurchases);
    const toggleHistory = usePurchaseStore(state => state.actions.toggleHistory);
    const toggleFavorites = useInteractionStore(state => state.actions.toggleFavorites);
    const favoriteCount = useInteractionStore(state => state.state.favoriteIds.length);

    return (
        <header className="bg-white shadow-md sticky top-0 z-20">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Loja</h1>
                <div className="flex items-center gap-6">
                    <button onClick={toggleHistory} className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="text-gray-600" viewBox="0 0 16 16">
                            <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zM1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5z" /> <path d="M2 5.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z" />
                        </svg>
                        {hasNewPurchases && (
                            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-3 w-3"></span>)
                        }
                    </button>
                    <button onClick={toggleFavorites} className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="text-gray-600" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                        </svg>
                        {favoriteCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{favoriteCount}</span>
                        )}
                    </button>
                    <button onClick={toggleCart} className="relative">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{totalItems}</span>
                        )}
                    </button>
                </div>
            </nav>
        </header>
    );
};