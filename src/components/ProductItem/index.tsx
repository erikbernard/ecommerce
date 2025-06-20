import { useCartStore } from "../../store/Cart";
import { useInteractionStore } from "../../store/Interaction";
import { useProductStore } from "../../store/Product";
import { EProvider, type Product } from "../../types";

export const ProductItem = ({ product }: { product: Product }) => {
    const addToCart = useCartStore((state) => state.actions.addToCart);
    const selectProduct = useProductStore((state) => state.actions.selectProduct);
    const {
        state: { favoriteIds },
        actions: { toggleFavorite }
    } = useInteractionStore();
    const isFavorite = favoriteIds.includes(product.id);
    const discountedPrice = product.price * (1 - product.discountValue);

    return (
        <div className="bg-white rounded-lg shadow-lg flex flex-col transition-transform duration-300 hover:-translate-y-1 relative">

            <button onClick={() => toggleFavorite(product.id)} className="absolute top-2 right-2 z-10 p-2 bg-white/70 rounded-full cursor-pointer" >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500 transition-colors duration-300'} viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>
            </button>
            <div onClick={() => selectProduct(product)} className="cursor-pointer">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                {product.hasDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        -{product.discountValue * 100}%
                    </div>
                )}
                <span className={
                    `${product.provider == EProvider.BRAZILIAN ? "bg-emerald-400" : "bg-indigo-400"}
                    text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full max-w-fit`}>
                    {product.provider == EProvider.BRAZILIAN ? "Brasileiro" : "Europeu"}
                </span>
                <h3 onClick={() => selectProduct(product)} className="text-lg font-semibold text-gray-800 flex-grow cursor-pointer">{product.name}</h3>
                <div className="mt-2">
                    {product.hasDiscount ? (
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-green-600">R$ {discountedPrice.toFixed(2)}</p>
                            <p className="text-sm font-light text-gray-500 line-through">R$ {product.price.toFixed(2)}</p>
                        </div>
                    ) : (
                        <p className="text-2xl font-bold text-green-600">R$ {product.price.toFixed(2)}</p>
                    )}
                </div>
                <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="mt-4 w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 transition-colors duration-300"> Adicionar ao Carrinho </button>
            </div>
        </div>
    );
};