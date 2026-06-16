import { getResenaById } from '../../../../app/actions/resenas';
import { notFound } from 'next/navigation';
import ReviewDetail from '../../../../components/ReviewDetail';

export default async function ViewReviewPage({ params }: { params: { id_resena: string } }) {
  const { id_resena } = await params;
  const idResenaNumber = parseInt(id_resena);
  
  if (isNaN(idResenaNumber)) notFound();

  const result = await getResenaById(idResenaNumber);
  if (!result.success || !result.resena) notFound();

  const resena = result.resena;

  return (
    <ReviewDetail
      resena={resena}
      backHref="/review"
      backLabel="Volver a mis pedidos"
      title="Detalle de tu Reseña"
    />
  );
}
