import PropertyCard from "./propertyCard";

type PropertyListProps = {
  onBuy?: (id: number | string) => void;
};

export default function PropertyList({ onBuy }: PropertyListProps) {
  return (
    <div className="pt-4 w-full flex justify-center">
      <div className="w-full max-w-8xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <PropertyCard key={i} id={i + 1} isFavorited={i % 3 === 0} onBuy={onBuy} />
        ))}
      </div>
    </div>
  );
}
