import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/Auth";
import { validateEmail, validatePassword } from "../../utils/validation";

export const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { state: { isAuthenticated }, actions: { register } } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setErrors(validatePassword(newPassword));
    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setEmailError(validateEmail(newEmail));
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const passwordErrors = validatePassword(password);
        const currentEmailError = validateEmail(email);

        setErrors(passwordErrors);
        setEmailError(currentEmailError);

        if (name && passwordErrors.length === 0 && !currentEmailError) {
            setIsLoading(true);
            await register(name, email, password, "pt-BR");
            setIsLoading(false);
            navigate("/login", { replace: true });
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Criar Conta</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input type="text" placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-slate-700" />
                    </div>
                    <div>
                        <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-slate-700" />
                        {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                    </div>
                    <div>
                        <input type="password" placeholder="Senha" value={password} onChange={handlePasswordChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-slate-700" />
                        {errors.map(error => <p key={error} className="text-red-500 text-xs mt-1">{error}</p>)}
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-bold  bg-slate-800 text-white rounded-lg cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors duration-300">
                        {isLoading ? 'Registrando...' : 'Registrar'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="font-medium text-blue-500 hover:underline">
                        Faça Login
                    </Link>
                </p>
            </div>
        </div>
    );
};