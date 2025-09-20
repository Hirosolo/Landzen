import Image from "next/image";

type Property = {
  propertyID?: number | string;
  propertyName?: string;
  description?: string;
  type?: string;
  propertyAddress?: string;
  googleMapUrl?: string;
  images?: string;
};

type Props = {
  property: Property | null;
};

export default function PropertyInfoContent({ property }: Props) {
  // Helper to show NaN for missing fields
  const getValue = (val: any) => (val === null || val === undefined || val === "" ? "NaN" : val);

  // Use property fields or fallback to NaN
  const name = getValue(property?.propertyName);
  const desc = getValue(property?.description);
  const address = getValue(property?.propertyAddress);
  const mapUrl = getValue(property?.googleMapUrl);
  const images = getValue(property?.images);
  const type = getValue(property?.type);

  return (
    <div className="min-h-screen bg-beige-100 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="col-span-2 space-y-4">
          <div className="relative w-full h-100 rounded-2xl overflow-hidden shadow-md">
            <img className="w-full fill" src={images !== "NaN" ? images : "/image-property.png"} alt="" />
          </div>
          
          {/* Property Details */}
          <div className="bg-beigi-100 rounded-2xl shadow p-4 space-y-4 text-moss-600">
            <h2 className="text-xl font-semibold">Properties Details</h2>
            <p className="flex items-center space-x-2 text-moss-600">
              <span>📍</span>
              <a href={mapUrl}>{address}</a>
            </p>
            <div className="flex space-x-3">
              <span className="px-3 py-1 bg-moss-600 rounded-full text-sm font-medium text-beige-100">
                {type}
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {desc}
            </p>

          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Project Raised */}
          <p className="text-moss-900 text-3xl font-bold">{name}</p>
          <div className="bg-moss-500 p-4 rounded-2xl shadow space-y-3">
            <h3 className="font-semibold text-lg text-moss-900">Project Raised</h3>
            <div className="w-full bg-[#78787833] rounded-full h-2.5">
              <div
                className="bg-moss-700 h-2.5 rounded-full"
                style={{ width: `50%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-100">
              0/0
            </p>
          </div>

          {/* Financial Returns */}
          <div className="bg-moss-500 p-6 rounded-2xl shadow space-y-6">
            <h3 className="font-semibold text-xl text-moss-900">Financial Returns</h3>
            <div className="flex items-center space-x-2">
              <div className="flex w-full rounded-xl overflow-hidden border border-moss-700">
                <input
                  type="number"
                  defaultValue={1}
                  className="w-full p-3 text-lg font-semibold bg-beige-100 focus:outline-none text-moss-700"
                />
                <span className="flex items-center px-4 font-bold text-moss-700 bg-beige-100">
                  NFT
                </span>
              </div>
              <button className="bg-moss-700 text-beige-100 px-6 py-3 rounded-xl font-semibold">
                INVEST
              </button>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-beige-100 text-base">
              <p className="font-semibold">Total Paid</p>
              <p className="text-right">NaN</p>
              <p className="font-semibold">Monthly Earned</p>
              <p className="text-right">NaN</p>
              <p className="font-semibold">Annually Earned</p>
              <p className="text-right">NaN</p>
              <p className="font-semibold">Start Date</p>
              <p className="text-right">NaN</p>
              <p className="font-semibold">End Date</p>
              <p className="text-right">NaN</p>
              <p className="font-semibold">Total Profit</p>
              <p className="text-right">NaN</p>
            </div>
          </div>

          {/* Investment Details */}
          <div className="bg-moss-500 p-4 rounded-2xl shadow space-y-4">
            <h3 className="font-semibold text-lg">Investment Details</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-moss-700">Property Value</p>
                <p className="font-bold text-moss-700">NaN</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-moss-700">Total Supply</p>
                <p className="font-bold text-moss-700">NaN</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-moss-700">NFT Price</p>
                <p className="font-bold text-moss-700">NaN</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-moss-700">Rental Yield</p>
                <p className="font-bold text-moss-700">NaN</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-moss-700">Annual Return</p>
                <p className="font-bold text-moss-700">NaN</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-moss-700">Project Length</p>
                <p className="font-bold text-moss-700">NaN</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}