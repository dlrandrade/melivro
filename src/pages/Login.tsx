import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import MetaTags from '../components/MetaTags';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignup, setIsSignup] = useState(false);
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
            navigate('/feed'); // Redirect to feed after login
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Generate a simple username from name
        const username = fullName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);

        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password: 'User123!', // Simple default password or user provided
            options: {
                data: {
                    full_name: fullName,
                    username: username
                }
            }
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (data.user) {
            // Create profile
            const { error: profileError } = await supabase.from('profiles').insert([
                {
                    id: data.user.id,
                    full_name: fullName,
                    username: username,
                    email: email,
                    role: 'user'
                }
            ]);

            if (profileError) {
                console.error('Error creating profile:', profileError);
            }

            alert('Cadastro realizado! Agora você pode postar no feed.');
            navigate('/feed');
        }
    };

    return (
        <>
            <MetaTags title="Login | MeLivro" description="Acesse sua conta no MeLivro" />
            <div className="min-h-[80vh] flex items-center justify-center px-6">
                <div className="max-w-md w-full bg-white p-10 rounded-2xl border border-[var(--border-color)] shadow-sm">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold tracking-tighter text-black uppercase mb-2">MeLivro</h1>
                        <p className="text-gray-500 font-medium">
                            {isSignup ? 'Crie sua conta para postar' : 'Acesse sua conta'}
                        </p>
                    </div>

                    <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        {isSignup && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                                    placeholder="Seu nome"
                                />
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
                            className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                        >
                            {loading ? 'Processando...' : isSignup ? 'Cadastrar e Postar' : 'Entrar'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsSignup(!isSignup)}
                            className="text-sm font-bold text-black border-b-2 border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors"
                        >
                            {isSignup ? 'Já tenho conta. Entrar.' : 'Não tem conta? Cadastre-se apenas com nome e e-mail.'}
                        </button>
                    </div>

                    <p className="mt-8 text-center text-xs text-gray-400">
                        Esqueceu sua senha? Entre em contato com o suporte.
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
