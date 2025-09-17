
export default function PropertyInfo() {
    return (
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side */}
        <div className="space-y-4">
          {/* Main image */}
          <img
            src="/image-property.png"
            alt="Property"
            className="w-full h-72 object-cover rounded-xl shadow"
          />
  
          {/* Thumbnails */}
          <div className="grid grid-cols-3 gap-2">
            <img src="/image-property.png" className="h-24 w-full object-cover rounded-md" />
            <img src="/image-property.png" className="h-24 w-full object-cover rounded-md" />
            <img src="/image-property.png" className="h-24 w-full object-cover rounded-md" />
          </div>
  
          {/* Location + description */}
          <div className="space-y-3">
            <div className="flex items-center text-gray-600 text-sm font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-1 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21c4.97-4.97 8-8.03 8-11.5A8 8 0 004 9.5C4 13 7.03 16.03 12 21z"
                />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              Ho Chi Minh
            </div>
  
            <p className="text-sm text-gray-700 leading-relaxed">
              Phuoc Thien arterial streets of Long Thanh My ward – District 9 – Thu Duc City –
              Ho Chi Minh City. Along with hundreds of perfect utilities with a selling price
              of only 1.9 billion – 7.9 billion/apartment, supporting 80% loan with principal
              grace and 0% interest rate, the project has been attracting thousands of
              first-time residents. Private and live...
            </p>
          </div>
        </div>
  
        {/* Right side */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">VINHOMES GRAND PARK</h1>
            <span className="text-sm bg-green-100 text-green-600 font-semibold px-2 py-1 rounded">
              APY 10%
            </span>
          </div>
  
          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded">Available</span>
              <span className="text-gray-600">500.000/1.000.000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "50%" }}></div>
            </div>
          </div>
  
          {/* Price info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm">PROPERTY VALUE</p>
              <p className="text-lg font-bold text-black">$1.000</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">PRICE PER TOKEN</p>
              <p className="text-lg font-bold text-black">$0.01</p>
            </div>
          </div>
  
          {/* Buy input */}
          <div className="flex items-center border rounded-lg p-2">
            <input
              type="number"
              placeholder="1.000"
              className="flex-1 px-2 py-1 outline-none text-gray-800"
            />
            <span className="px-3 text-gray-600 font-semibold">VGP</span>
            <span className="px-3 text-gray-600">$100</span>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              BUY NOW
            </button>
          </div>
  
          {/* Overview */}
          <div className="border rounded-xl p-4 space-y-4">
            <h2 className="font-semibold text-gray-800">Overview</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="border rounded-md p-2">
                <p className="text-gray-500">Type</p>
                <p className="font-medium">Residential Home</p>
              </div>
              <div className="border rounded-md p-2">
                <p className="text-gray-500">Area</p>
                <p className="font-medium">180</p>
              </div>
              <div className="border rounded-md p-2">
                <p className="text-gray-500">Bedrooms</p>
                <p className="font-medium">Residential Home</p>
              </div>
              <div className="border rounded-md p-2">
                <p className="text-gray-500">Restrooms</p>
                <p className="font-medium">Residential Home</p>
              </div>
              <div className="border rounded-md p-2">
                <p className="text-gray-500">Parking</p>
                <p className="font-medium">180</p>
              </div>
              <div className="border rounded-md p-2">
                <p className="text-gray-500">Year built</p>
                <p className="font-medium">Residential Home</p>
              </div>
            </div>
          </div>
  
          {/* Economics */}
          <div className="border rounded-xl p-4 space-y-4">
            <h2 className="font-semibold text-gray-800">Economics</h2>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="border rounded-md p-2">
                <p className="text-gray-500">Model</p>
                <p className="font-medium">Rental Income</p>
              </div>
              <div className="border rounded-md p-2">
                <p className="text-gray-500">Income/ month</p>
                <p className="font-medium">$1,200</p>
              </div>
              <div className="border rounded-md p-2">
                <p className="text-gray-500">Holders</p>
                <p className="font-medium">145</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  