import PropertyCard from "./propertyCard";

export default function PropertyList() {
  return (
    <div className="pt-7 w-full flex justify-center">
      <div className="w-full max-w-8xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <PropertyCard key={i} />
        ))}
      </div>
    </div>
  );
}
