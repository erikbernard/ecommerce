import { useState } from "react";
import { useCartStore } from "../../store/Cart";
import { useCheckoutStore } from "../../store/Checkout";

export const Cart = () => {
    const {
        state: { cartItems, isCartOpen, totalPrice },
        actions: { toggleCart, removeFromCart, addToCart, decreaseQuantity }
    } = useCartStore();
    const openCheckout = useCheckoutStore(state => state.actions.openCheckout);
    const [isCheckingOut] = useState(false);

    const handleCheckout = () => {
        openCheckout();
        toggleCart();
    };

    if (!isCartOpen) return null;
    //TODO: componentizar o menu lateralm melhoria animations, etc
    return (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={toggleCart}>
            <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Seu Carrinho</h2>
                    <button onClick={toggleCart} className="text-2xl">&times;</button>
                </header>
                <div className="flex-grow overflow-y-auto p-4">
                    {cartItems.length === 0 ? <p>Seu carrinho está vazio.</p> : cartItems.map(item => (
                        <div key={item.id} className="flex items-center gap-4 mb-4">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            <div className="flex-grow">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <button onClick={() => decreaseQuantity(item.id)} className="w-6 h-6 border rounded">-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => addToCart(item)} className="w-6 h-6 border rounded">+</button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline">Remover</button>
                            </div>
                        </div>
                    ))}
                </div>
                {cartItems.length > 0 && (
                    <footer className="p-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-bold">Total:</span>
                            <span className="text-xl font-bold text-green-600">R$ {totalPrice.toFixed(2)}</span>
                        </div>
                        <button onClick={handleCheckout} disabled={isCheckingOut} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">Ir para Pagamento</button>
                    </footer>
                )}
            </div>
        </div>
    );
};