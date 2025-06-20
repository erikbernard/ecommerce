import { useState, type ChangeEvent, type FormEvent } from "react";
import { useCheckoutStore } from "../../store/Checkout";
import { validateCheckoutForm, type CheckoutFormData } from "../../utils/validation";
import { useAuthStore } from "../../store/Auth";

export const CheckoutModal = () => {
    const { user } = useAuthStore.getState().state;
    const {
        state: { isCheckoutOpen, paymentMethod },
        actions: { closeCheckout, setPaymentMethod, processOrder }
    } = useCheckoutStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState<CheckoutFormData>({
        fullName: user.name, email: user.email, address: '', cardNumber: '', expiry: '', cvc: ''
    });

    const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

    const handleFinalize = async (e: FormEvent) => {
        e.preventDefault();
        const validationErrors = validateCheckoutForm(formData, paymentMethod);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsProcessing(true);
            await processOrder(formData);
            setIsProcessing(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'cardNumber') processedValue = value.replace(/\D/g, '').slice(0, 16);
        if (name === 'expiry') {
            processedValue = value.replace(/\D/g, '').slice(0, 4);
            if (processedValue.length > 2) processedValue = `${processedValue.slice(0, 2)}/${processedValue.slice(2)}`;
        }
        if (name === 'cvc') processedValue = value.replace(/\D/g, '').slice(0, 3);

        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    if (!isCheckoutOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-40 flex justify-center items-center p-4">
            <div className="bg-gray-100 rounded-lg shadow-xl w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={closeCheckout} className="absolute top-2 right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <form onSubmit={handleFinalize}>
                    <header className="p-4 border-b bg-white rounded-t-lg"><h2 className="text-2xl font-bold text-center">Pagamento</h2></header>
                    <main className="p-6 space-y-6">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg " role="alert" aria-labelledby="Aviso sobre os dados do cartão">
                            <div className="flex p-4">
                                <div className="shrink-0">
                                    <svg className="shrink-0 size-4 text-blue-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
                                    </svg>
                                </div>
                                <div className="ms-3">
                                    <p id="hs-toast-normal-example-label" className="text-sm text-gray-700">
                                        Os dados do cartão são apenas para fins de teste. Use <strong>4242 4242 4242 4242</strong> como número do cartão, qualquer data de validade futura e qualquer CVC.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Seus Dados</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <input name="fullName" value={formData.fullName} onChange={handleChange}
                                        className="p-2 border rounded w-full" placeholder="Nome Completo" />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </div>
                                <div>
                                    <input name="email" type="email" value={formData.email} onChange={handleChange}
                                        className="p-2 border rounded w-full" placeholder="Email" />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <input name="address" value={formData.address} onChange={handleChange}
                                        className="p-2 border rounded w-full" placeholder="Endereço" />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Forma de Pagamento</h3>
                            <div className="flex gap-4 mb-4">
                                <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 p-3 rounded border-2 ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : ''}`}>Cartão</button>
                                <button type="button" onClick={() => setPaymentMethod('pix')} className={`flex-1 p-3 rounded border-2 ${paymentMethod === 'pix' ? 'border-blue-500 bg-blue-50' : ''}`}>PIX</button>
                            </div>
                            {paymentMethod === 'card' && (
                                <div className="space-y-4">
                                    <div>
                                        <input name="cardNumber" value={formData.cardNumber} onChange={handleChange}
                                            className="w-full p-2 border rounded" placeholder="Número do Cartão" />
                                        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input name="expiry" value={formData.expiry} onChange={handleChange}
                                                className="p-2 border rounded w-full" placeholder="Validade (MM/AA)" />
                                            {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                                        </div>
                                        <div>
                                            <input name="cvc" value={formData.cvc} onChange={handleChange}
                                                className="p-2 border rounded w-full" placeholder="CVC" />
                                            {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {paymentMethod === 'pix' && (
                                <div className="text-center p-4 bg-gray-200 rounded">
                                    <p>Escaneie o QR Code</p>
                                    <div className="w-40 h-40 bg-white mx-auto my-4 grid place-items-center text-xs">QR Code Simulado</div>
                                    <p className="text-sm">Chave PIX:
                                        <strong>a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6</strong>
                                    </p>
                                </div>
                            )}
                        </div>
                    </main>
                    <footer className="p-4 bg-white rounded-b-lg">
                        <button type="submit" disabled={isProcessing}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-green-300">
                            {isProcessing ? 'Processando...' : 'Finalizar Compra'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    )
};