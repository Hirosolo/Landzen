import SearchBar from "./components/marketplace/searchBar";
import NavBar from "./components/marketplace/navBar";
import PropertyList from "./components/marketplace/propertyList";
import Paging from "./components/marketplace/paging";

export default function Home() {
  return (
    <div>
      <SearchBar />
      {/*welcome message */}
      <section className="bg-blue-800 text-white py-30">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            Marketplace for Tokenized Real Estate
          </h1>

          <p className="mt-4 text-sm md:text-base font-medium">
            Invest in fractional ownership of premium real estate globally with full transparency on blockchain
          </p>
        </div>
      </section>

      {/*navigation bar*/}
      <NavBar />

      {/*search and filter */}
      <div className="flex flex-wrap gap-3 items-center pt-5">

        <div className="flex items-center border rounded-md px-3 py-2 w-64">
          <svg xmlns="http://www.w3.org/2000/svg" 
              fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
              stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" 
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.25 5.25a7.5 7.5 0 0011.5 11.5z" />
          </svg>
          <input type="text" placeholder="Search" 
                className="ml-2 w-full outline-none border-none text-sm text-gray-700 placeholder-gray-400"/>
        </div>

        <select className="border rounded-md px-3 py-2 text-sm text-gray-700">
          <option>Sort by name (A–Z)</option>
          <option>Sort by name (Z–A)</option>
          <option>Sort by value</option>
        </select>

        <select className="border rounded-full px-4 py-2 text-sm text-gray-700">
          <option>Location</option>
        </select>
        <select className="border rounded-full px-4 py-2 text-sm text-gray-700">
          <option>Asset type</option>
        </select>
        <select className="border rounded-full px-4 py-2 text-sm text-gray-700">
          <option>Interest rate</option>
        </select>
        <select className="border rounded-full px-4 py-2 text-sm text-gray-700">
          <option>Property value</option>
        </select>
        <select className="border rounded-full px-4 py-2 text-sm text-gray-700">
          <option>Token price</option>
        </select>
        <select className="border rounded-full px-4 py-2 text-sm text-gray-700">
          <option>Earning models</option>
        </select>
      </div>

      {/*property grid */}
        <PropertyList/>

      {/*paging */}
      <Paging/>

    </div>
  );
}
