import { useCartStore } from "../../store/Cart";
import { useInteractionStore } from "../../store/Interaction";
import { useProductStore } from "../../store/Product";
import { EProvider, type Product } from "../../types";

export const ProductDetailModal = () => {
    const {
        state: { selectedProduct: product, products },
        actions: { selectProduct }
    } = useProductStore();
    const {
        actions: { addToCart }
    } = useCartStore();
    const {
        state: { recentlyViewedIds, favoriteIds },
        actions: { toggleFavorite }
    } = useInteractionStore();


    const recentlyViewedProducts = recentlyViewedIds.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];

    if (!product) return null;
    const isFavorite = favoriteIds.includes(product.id);

    return (
        <div className="fixed inset-0 bg-black/70 z-40 flex justify-center items-center" onClick={() => selectProduct(null)}>
            <div className="bg-white rounded-lg shadow-xl w-[24rem] max-w-[90vw] sm:max-w-none md:w-full md:max-w-4xl flex flex-col" onClick={e => e.stopPropagation()}>

                <button onClick={() => selectProduct(null)} className="self-end mt-2.5 mr-2.5 p-1 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-6 pt-0 flex flex-col md:flex-row gap-6">
                    <img src={product.image} alt={product.name} className="w-full md:w-1/2 h-64 md:h-auto object-cover rounded-lg" />
                    <div className="flex flex-col flex-1">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h2>
                        <div className="flex items-center mb-4">
                            <span className={`${product.provider == EProvider.BRAZILIAN ? "bg-emerald-400" : "bg-indigo-400"}
                                    text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full max-w-fit`}>
                                    {product.provider == EProvider.BRAZILIAN ? "Brasileiro" : "Europeu"}
                            </span>
                            {product.hasDiscount && (
                                <div className="bg-red-500 text-white text-xs font-bold  me-2 px-2.5 py-0.5 rounded-full max-w-fit">
                                    -{product.discountValue * 100}%
                                </div>
                            )}
                        </div>

                        <p className="text-gray-600 flex-grow mb-4">{product.description}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                            <div className="flex items-center gap-4">
                                <button onClick={() => toggleFavorite(product.id)} className="p-2 bg-gray-200 rounded-full cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500 transition-colors duration-300'} viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                                    </svg>
                                </button>
                                <button onClick={() => { addToCart(product); selectProduct(null) }} className="bg-slate-800 text-white py-2 px-6 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors duration-300">Adicionar ao Carrinho</button>
                            </div>
                        </div>
                    </div>
                </div>
                {recentlyViewedProducts.length > 1 &&
                    <div className="p-6 border-t">
                        <h3 className="text-xl font-semibold mb-4">Vistos Recentemente</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {recentlyViewedProducts.filter(p => p.id !== product.id).map(p => (
                                <div key={p.id} onClick={() => selectProduct(p)} className="flex-shrink-0 w-32 cursor-pointer">
                                    <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded-md" />
                                    <p className="text-sm mt-2 truncate">{p.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};