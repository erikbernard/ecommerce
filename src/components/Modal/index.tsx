import { useModalStore } from "../../store/Modal";

export const Modal = () => {
    const {
        actions: { hideModal },
        state: { isOpen, message, status }
    } = useModalStore();
    if (!isOpen) return null;

    const modalIcons = {
        info: {
            containerClass: "inline-flex items-center justify-center shrink-0 w-12 h-12 text-blue-500 bg-blue-100 rounded-lg",
            path: "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
        },
        error: {
            containerClass: "inline-flex items-center justify-center shrink-0 w-12 h-12 text-red-500 bg-red-100 rounded-lg",
            path: "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
        },
        success: {
            containerClass: "inline-flex items-center justify-center shrink-0 w-12 h-12 text-green-500 bg-green-100 rounded-lg",
            path: "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
        }
    };
    const iconConfig = modalIcons[status as keyof typeof modalIcons];
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" onClick={hideModal}>
            
            <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm" onClick={e => e.stopPropagation()}>
                
                {iconConfig && (
                    <div className={iconConfig.containerClass}>
                        <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d={iconConfig.path} />
                        </svg>
                    </div>
                )}

                <p className="mb-4 text-lg">{message}</p>
                <button onClick={hideModal} className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700">Fechar</button>
            </div>
        </div>
    );
};