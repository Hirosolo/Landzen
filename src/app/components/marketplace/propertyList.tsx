import { useEffect, useState } from "react";
import PropertyCard from "./propertyCard";

type Property = {
  propertyID?: number | string;
  propertyName?: string;
  description?: string;
  propertyAddress?: string;
  googleMapUrl?: string;
  images?: string;
};

type PropertyListProps = {
  onBuy?: (property: Property) => void;
};

export default function PropertyList({ onBuy }: PropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  useEffect(() => {
    fetch("/api/properties/all")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProperties(data);
        } else {
          setProperties([]);
        }
      })
      .catch(() => setProperties([]));
  }, []);

  return (
    <div className="pt-4 w-full flex justify-center">
      <div className="w-full max-w-8xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.propertyID}
            property={property}
            onBuy={() => onBuy?.(property)}
          />
        ))}
      </div>
    </div>
  );
}
