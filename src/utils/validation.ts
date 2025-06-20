export const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('A senha deve ter no mínimo 8 caracteres.');
    if (password.length > 20) errors.push('A senha deve ter no máximo 20 caracteres.');
    if (!/[a-z]/.test(password)) errors.push('A senha deve conter pelo menos uma letra minúscula.');
    if (!/[A-Z]/.test(password)) errors.push('A senha deve conter pelo menos uma letra maiúscula.');
    if (!/\d/.test(password)) errors.push('A senha deve conter pelo menos um número.');
    if (!/[@$!%*?&]/.test(password)) errors.push('A senha deve conter pelo menos um caractere especial (@$!%*?&).');
    return errors;
}

export const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Por favor, insira um e-mail válido.';
    return null;
}


export type CheckoutFormData = {
    fullName: string;
    email: string;
    address: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
};


export const validateCheckoutForm = (formData: CheckoutFormData, paymentMethod: 'card' | 'pix'): Partial<CheckoutFormData> => {
    const validations: Partial<CheckoutFormData> = {};
    if (!formData.fullName.trim()) validations.fullName = "O nome completo é obrigatório";

    if (!formData.email.trim()) {
        validations.email = "O email é obrigatório";
    } else if (validateEmail(formData.email)) {
        validations.email = "Um email válido é obrigatório";
    }

    if (!formData.address.trim()) validations.address = "O endereço é obrigatório";

    if (paymentMethod === 'card') {
        if (!formData.cardNumber.trim()) validations.cardNumber = "O número do cartão é obrigatório";
        else if (!/^\d+$/.test(formData.cardNumber)) validations.cardNumber = "Apenas números são permitidos";

        if (!formData.expiry.trim()) validations.expiry = "A data de validade é obrigatória";
        else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) validations.expiry = "Formato inválido (MM/AA)";

        if (!formData.cvc.trim()) validations.cvc = "O CVC é obrigatório";
        else if (!/^\d{3}$/.test(formData.cvc)) validations.cvc = "CVC deve ter 3 dígitos";
    }

    return validations;
};
