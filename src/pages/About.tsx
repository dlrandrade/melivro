import React from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../components/MetaTags';

const About: React.FC = () => {
  return (
    <>
      <MetaTags
        title="Sobre o MeLivro | Nossa Missão"
        description="MeLivro nasceu de uma premissa simples: as pessoas que admiramos são um reflexo dos livros que elas leem. Conectamos você às mentes mais brilhantes."
      />
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="font-serif text-6xl font-bold text-black tracking-tighter">
            Nós acreditamos no poder das ideias.
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto mt-4">
            MeLivro nasceu de uma premissa simples: as pessoas que admiramos são um reflexo dos livros que elas leem.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-lg border border-[var(--border-color)]">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-justify space-y-6">
            <p>
              Nossa missão é criar uma ponte entre você e as mentes mais brilhantes do nosso tempo, através de suas estantes. Em vez de algoritmos impessoais, oferecemos curadoria humana. Conectamos cada recomendação à sua fonte original — uma entrevista, um podcast, um artigo — para que você entenda o "porquê" por trás de cada leitura.
            </p>
            <p>
              Aqui, você não apenas descobre o que ler, mas também constrói sua própria jornada de conhecimento, inspirando-se diretamente em quem já trilhou caminhos de sucesso, criatividade e sabedoria.
            </p>
            <p>
              Junte-se a uma comunidade de leitores curiosos. Defina suas metas, compartilhe suas leituras e descubra sua próxima grande ideia.
            </p>
          </div>

          <div className="text-center mt-12 border-t border-[var(--border-color)] pt-10">
            <h2 className="font-serif text-3xl font-bold tracking-tighter mb-4">Pronto para começar?</h2>
            <Link to="/personalidades" className="inline-block bg-black text-white px-8 py-3 rounded-md font-bold text-sm hover:bg-gray-800 transition-all">
              Explore as Personalidades
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;