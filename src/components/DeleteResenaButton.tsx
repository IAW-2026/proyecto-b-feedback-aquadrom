'use client';

import { Trash2 } from 'lucide-react';
import { deleteResena } from '../app/actions/moderacion';
import { useState } from 'react';

export default function DeleteResenaButton({ id_resena }: { id_resena: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer.')) {
      setIsDeleting(true);
      await deleteResena(id_resena);
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className={`text-rose-500 hover:text-rose-700 transition-colors ${isDeleting ? 'opacity-50' : ''}`}
      title="Eliminar reseña"
    >
      <Trash2 size={18} />
    </button>
  );
}
