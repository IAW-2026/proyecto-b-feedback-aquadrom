import { getResenaById } from '../../../actions/resenas';
import { getVendorDetails } from '../../../../lib/mockApi';
import { notFound } from 'next/navigation';
import ReviewDetail from '../../../../components/ReviewDetail';

export default async function ViewPublicReviewPage({ params }: { params: { id_resena: string } }) {
  const { id_resena } = await params;
  const idResenaNumber = parseInt(id_resena);
  
  if (isNaN(idResenaNumber)) notFound();

  const result = await getResenaById(idResenaNumber);
  if (!result.success || !result.resena) notFound();

  const resena = result.resena;
  const vendor = await getVendorDetails(resena.id_vendedor);

  return (
    <ReviewDetail
      resena={resena}
      backHref="/resenas"
      backLabel="Volver a reseñas"
      title="Detalle de Reseña"
      vendor={vendor}
    />
  );
}
