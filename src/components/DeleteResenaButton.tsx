'use client';

import { Trash2 } from 'lucide-react';
import { deleteResena } from '../app/actions/moderacion';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

export default function DeleteResenaButton({ id_resena }: { id_resena: number }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteResena(id_resena);
    setIsDeleting(false);
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className={`text-rose-500 hover:text-rose-700 transition-colors ${isDeleting ? 'opacity-50' : ''}`}
        title="Eliminar reseña"
      >
        <Trash2 size={18} />
      </button>

      <ConfirmModal
        open={showConfirm}
        title="Eliminar reseña"
        message="¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
