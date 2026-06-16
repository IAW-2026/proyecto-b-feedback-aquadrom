import { getSellerResenas } from '../../actions/seller';
import ImageLightbox from '../../../components/ImageLightbox';

export default async function SellerResenasPage() {
  const result = await getSellerResenas();

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Error de Acceso</h1>
        <p className="text-slate-600 max-w-md">
          No se pudo obtener la información de las reseñas.
        </p>
      </div>
    );
  }

  const resenas = result.resenas ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Mis Reseñas</h1>
        <p className="text-slate-600">Lista de valoraciones recibidas por tus clientes.</p>
      </div>

      {resenas.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293H//C12 13 12 13 12 13z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Aún no tienes reseñas</h3>
          <p className="text-slate-500">Cuando los clientes valoren tus pedidos, aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {resenas.map((resena) => (
            <div key={resena.id_resena} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {resena.id_usuario.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Usuario: {resena.id_usuario}</p>
                    <p className="text-xs text-slate-500">Pedido: {resena.id_pedido}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <span>{resena.estrellas}</span>
                  <span>★</span>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-slate-700 italic text-sm leading-relaxed">
                  "{resena.comentario || 'Sin comentario'}"
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-400">
                  {resena.fecha.toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
                <ImageLightbox foto={resena.foto} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
