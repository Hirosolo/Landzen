export default function NavBar() {
return(
    <div className="mt-5 w-full flex justify-center">
        <div className="inline-flex border border-gray-300 rounded-full overflow-hidden">
        <button className="px-6 py-2 text-sm font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200">
            All projects
        </button>
        <button className="px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:bg-gray-200">
            Residential Homes
        </button>
        <button className="px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:bg-gray-200">
            Apartments
        </button>
        <button className="px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:bg-gray-200">
            Co-Living
        </button>
        <button className="px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:bg-gray-200">
            Hospitality
        </button>
        </div>
    </div>
);
}
