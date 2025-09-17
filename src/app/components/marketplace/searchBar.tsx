"use client";
export default function SearchBar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div className="flex items-center gap-4">
        <button className="p-2" aria-label="Open menu">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="4" width="24" height="2" rx="1" fill="#333" />
            <rect y="11" width="24" height="2" rx="1" fill="#333" />
            <rect y="18" width="24" height="2" rx="1" fill="#333" />
          </svg>
        </button>
        <img
          src="/logo-UIT.svg"
          onClick={() => (window.location.href = "/recuiter/landingPage")}
          alt="Logo"
          className="h-8 w-9 cursor-pointer"
        />
      </div>
      <div className="relative flex-1 flex justify-center">
        <div className="self-end flex items-center w-full max-w-md rounded-full border border-gray-200 bg-white shadow-sm px-3 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-5 h-5 text-gray-400"
          >
            <path
              strokeLinecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.25 5.25a7.5 7.5 0 0011.5 11.5z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search..."
            className="ml-2 flex-1 border-none focus:ring-0 text-gray-700 placeholder-gray-400 outline-none"
          />

          <span className="ml-2 px-2 py-0.5 text-gray-400 text-sm bg-gray-100 rounded">
            /
          </span>
        </div>
      </div>
      <div className="w-23"></div>
    </nav>
  );
}
