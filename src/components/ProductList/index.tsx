import { useEffect } from "react";
import { Pagination } from "../Pagination";
import { useProductStore } from "../../store/Product";
import { ProductItem } from "../ProductItem";
import { Filter } from "../Filters";

export const ProductList = () => {
    const {
        state: { products, isLoading, error },
        actions: { fetchProducts }
    } = useProductStore();

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts]);

    if (isLoading && products.length === 0)
        return (
            <div className="text-center p-10">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-lg">Carregando produtos...</p>
            </div>
        );

    if (error) return <div className="text-center p-10 text-red-500">Erro: {error}</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Nossos Produtos</h2>
            <Filter.Root>
                <Filter.Search />
                <Filter.Price />
                <Filter.Sort />
                <Filter.Origin />
                <Filter.Discount />
            </Filter.Root>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => (<ProductItem key={product.id} product={product} />))}
            </div>
            <Pagination />
        </div>
    );
};
