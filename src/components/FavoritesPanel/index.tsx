import { useInteractionStore } from "../../store/Interaction";
import { useProductStore } from "../../store/Product";
import { ProductItem } from "../ProductItem";

export const FavoritesPanel = () => {
    const {
        state: { isFavoritesOpen, favoriteIds },
        actions: { toggleFavorites }
    } = useInteractionStore();
    const allProducts = useProductStore(state => state.state.products);
    const favoriteProducts = allProducts.filter(p => favoriteIds.includes(p.id));

    if (!isFavoritesOpen) return null;
    //TODO: componentizar o menu lateralm melhoria animations, etc
    return (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={toggleFavorites}>
            <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Seus Favoritos</h2>
                    <button onClick={toggleFavorites} className="text-2xl">&times;</button>
                </header>
                <div className="flex flex-col items-stretch gap-4 overflow-y-auto p-4">
                    {favoriteProducts.length === 0 ?
                        <p>Você não tem produtos favoritos.</p> : favoriteProducts.map(item =>
                            <ProductItem key={item.id} product={item} />
                        )
                    }
                </div>
            </div>
        </div>
    );
};
