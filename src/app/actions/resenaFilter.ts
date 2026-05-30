'use server';

import { redirect } from 'next/navigation';

export async function handleFilter(formData: FormData) {
  const sId = formData.get('sellerId');
  redirect(`/resenas?sellerId=${sId}`);
}
