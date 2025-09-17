"use client";
import React, { useState } from "react";

export default function Paging() {
  const totalPages = 10;
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div className="flex justify-end items-center gap-2 mb-8 text-black pt-5">
      {/*previous button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p - 1))}
        className="px-4 mt-2 py-1.5 border border-gray-200 rounded bg-gray-50 disable:opacity-50"
      >
        &lt;
      </button>

      {/*current page */}
      <select
        value={currentPage}
        onChange={(e) => setCurrentPage(Number(e.target.value))}
        className="px-2 py-2 mt-2 rounded border border-gray-200 bg-gray-50 disable:opacity-50 "
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <option key={page} value={page}>
            Page {page}
          </option>
        ))}
      </select>

      {/*next button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        className="px-4 mt-2 py-1.5 mr-5 border border-gray-200 rounded bg-gray-50 disable:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
}
