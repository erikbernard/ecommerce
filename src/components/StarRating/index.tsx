import { usePurchaseStore } from "../../store/Purchase";

export const StarRating = ({ productId }: { productId: number }) => {
    const rating = usePurchaseStore(state => state.state.reviews[productId] || 0);
    const addReview = usePurchaseStore(state => state.actions.addReview);
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button key={ratingValue} onClick={() => addReview(productId, ratingValue)} className="text-2xl cursor-pointer transition-transform duration-150 ease-in-out transform hover:scale-125">
                        <span className={ratingValue <= rating ? 'text-yellow-400' : 'text-gray-300'}> &#9733; </span>
                    </button>
                );
            })}
        </div>
    );
};
