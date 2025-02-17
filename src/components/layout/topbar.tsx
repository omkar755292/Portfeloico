'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, User } from 'lucide-react';
import { useAppDispatch } from '@/hooks/providers';
import { logout } from '@/store/slices/userSlice';

export default function TopBar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className="h-16 bg-white">
      <div className="flex items-center justify-end h-full px-4">
        {/* Right section with notifications and profile */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Account Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => dispatch(logout())}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}