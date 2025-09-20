
import PropertyInfoContent from '../../components/propertyInfo/PropertyInfoContent';
import { Suspense } from 'react';

type PageProps = {
  params: { id: string };
};

async function getProperty(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/properties/${id}`);
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch {
    return null;
  }
}

export default async function PropertyInfo({ params }: PageProps) {
  const property = await getProperty(params.id);
  return (
    <div className="min-h-screen bg-beige-100">
      <div className="max-w-7xl mx-auto p-6">
        <Suspense fallback={<div>Loading...</div>}>
          <PropertyInfoContent property={property} />
        </Suspense>
      </div>
    </div>
  );
}
