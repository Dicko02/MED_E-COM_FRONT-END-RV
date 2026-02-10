
export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-light text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-500 mb-8">Page introuvable</p>
        <a 
          href="/" 
          className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};