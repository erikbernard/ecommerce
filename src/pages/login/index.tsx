import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/validation";
import { useAuthStore } from "../../store/Auth";

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [emailError, setEmailError] = useState<string | null>(null);
    const { state: { isAuthenticated, error, isLoading }, actions: { login } } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

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

        if (passwordErrors.length === 0 && !currentEmailError) {
            await login(email, password);
            navigate(from, { replace: true });
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center uppercase">Login e-commerce</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-slate-700" />
                        {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                    </div>
                    <div>
                        <input type="password" placeholder="Senha" value={password} onChange={handlePasswordChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-slate-700" />
                        {errors.map(error => <p key={error} className="text-red-500 text-xs mt-1">{error}</p>)}
                    </div>
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    <button type="submit" disabled={isLoading}
                        className="w-full px-4 py-2 font-bold  bg-slate-800 text-white rounded-lg cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors duration-300 ">
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Não tem uma conta?{' '}
                    <Link to="/register" className="font-medium text-blue-500 hover:underline">
                        Registre-se
                    </Link>
                </p>
            </div>
        </div>
    );
};