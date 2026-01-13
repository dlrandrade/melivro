
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-serif text-5xl font-bold text-black tracking-tighter">Meu Dashboard</h1>
        <p className="text-lg text-gray-500 mt-2">Acesso rápido às suas ferramentas e atividades.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Admin Panel Card */}
        <Link to="/admin" className="block p-8 bg-black text-white rounded-lg hover:bg-gray-800 transition-all">
          <h2 className="font-bold text-2xl mb-2">Painel de Administração</h2>
          <p className="text-gray-300">Gerencie personalidades, livros e citações. Use a curadoria com Gemini para enriquecer o conteúdo.</p>
        </Link>

        {/* Profile Card */}
        <Link to="/profile/me" className="block p-8 bg-white border border-[var(--border-color)] rounded-lg hover:border-black transition-all">
          <h2 className="font-bold text-2xl mb-2">Meu Perfil Público</h2>
          <p className="text-gray-600">Veja seu perfil, gerencie sua meta de leitura anual e acompanhe seu progresso.</p>
        </Link>

        {/* Feed Card */}
        <Link to="/feed" className="block p-8 bg-white border border-[var(--border-color)] rounded-lg hover:border-black transition-all">
          <h2 className="font-bold text-2xl mb-2">Feed da Comunidade</h2>
          <p className="text-gray-600">Descubra o que outras pessoas estão lendo, comentando e adicionando às suas listas.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
