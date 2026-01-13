import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import MetaTags from '../components/MetaTags';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/admin');
        }
    };

    return (
        <>
            <MetaTags title="Login | MeLivro" description="Acesse sua conta no MeLivro" />
            <div className="min-h-[80vh] flex items-center justify-center px-6">
                <div className="max-w-md w-full bg-white p-10 rounded-2xl border border-[var(--border-color)] shadow-sm">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold tracking-tighter text-black uppercase mb-2">MeLivro</h1>
                        <p className="text-gray-500 font-medium">Acesso restrito para administradores</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Entrando...' : 'Entrar no Painel'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-gray-400">
                        Esqueceu sua senha? Entre em contato com o suporte.
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
