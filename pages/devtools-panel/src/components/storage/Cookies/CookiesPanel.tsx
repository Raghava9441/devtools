import React, { useState } from 'react';

type Cookie = {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: string;
  size: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: string;
};

function CookiesPanel() {
  const [cookies, setCookies] = useState<Cookie[]>([
    {
      name: 'session_id',
      value: 'abc123def456',
      domain: '.example.com',
      path: '/',
      expires: '2024-12-31T23:59:59Z',
      size: 23,
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    },
    {
      name: 'user_preference',
      value: 'dark_mode',
      domain: '.example.com',
      path: '/',
      expires: '2024-12-31T23:59:59Z',
      size: 9,
      httpOnly: false,
      secure: false,
      sameSite: 'Lax'
    },
    {
      name: 'analytics_id',
      value: 'ga_123456789',
      domain: '.example.com',
      path: '/',
      expires: '2025-12-31T23:59:59Z',
      size: 13,
      httpOnly: false,
      secure: true,
      sameSite: 'None'
    }
  ]);

  const [selectedCookie, setSelectedCookie] = useState<Cookie | null>(null);

  const handleDelete = (name: string) => {
    setCookies(cookies => cookies.filter(cookie => cookie.name !== name));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
              Add Cookie
            </button>
            <button className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">
              Clear All
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {cookies.length} cookies
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Table View */}
        <div className="flex-1 border-r border-gray-200 dark:border-gray-600">
          <div className="bg-white dark:bg-gray-800">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Value
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Domain
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Path
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expires
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Size
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {cookies.map((cookie) => (
                  <tr
                    key={cookie.name}
                    className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedCookie(cookie)}
                  >
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {cookie.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {cookie.value.length > 20 ? `${cookie.value.substring(0, 20)}...` : cookie.value}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {cookie.domain}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {cookie.path}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(cookie.expires).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {cookie.size} B
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(cookie.name);
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Panel */}
        {selectedCookie && (
          <div className="w-80 bg-gray-50 dark:bg-gray-700 p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Cookie Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <div className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">
                  {selectedCookie.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Value
                </label>
                <div className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">
                  {selectedCookie.value}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Domain
                </label>
                <div className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">
                  {selectedCookie.domain}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Path
                </label>
                <div className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">
                  {selectedCookie.path}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expires
                </label>
                <div className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">
                  {new Date(selectedCookie.expires).toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    HttpOnly
                  </label>
                  <div className={`px-3 py-2 rounded text-sm ${
                    selectedCookie.httpOnly 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {selectedCookie.httpOnly ? 'Yes' : 'No'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Secure
                  </label>
                  <div className={`px-3 py-2 rounded text-sm ${
                    selectedCookie.secure 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {selectedCookie.secure ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SameSite
                </label>
                <div className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">
                  {selectedCookie.sameSite}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CookiesPanel;