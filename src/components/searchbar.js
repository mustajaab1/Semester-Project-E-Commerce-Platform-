// src/components/SearchBar.js
import React from 'react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search products…"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
