'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useAuth } from '@/hooks/useAuth';
import { Moon, Sun, UserCircle2, LogOut, User, Menu, X } from 'lucide-react';
import { toggleDarkMode } from '@/store/themeSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.theme.isDarkMode);
  const { user, signOut } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const theme = {
    primary: isDark ? '#ff8833' : '#ff6a00',
    secondary: isDark ? '#1f1f1f' : '#f8fafc',
    background: isDark ? '#121212' : '#ffffff',
    foreground: isDark ? '#f3f4f6' : '#111827',
    border: isDark ? '#374151' : '#d1d5db',
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      style={{
        backgroundColor: theme.secondary,
        color: theme.foreground,
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      }}
      className="w-full px-6 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50"
    >
      <Link href="/" className="text-xl font-bold" style={{ color: theme.primary }}>
        FastMover
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <Link href="/about" className="hover:opacity-75" style={{ color: theme.foreground }}>About</Link>
        <Link href="/book" className="hover:opacity-75" style={{ color: theme.foreground }}>Book</Link>
        <Link href="/contact" className="hover:opacity-75" style={{ color: theme.foreground }}>Contact</Link>

        <button
          onClick={() => dispatch(toggleDarkMode())}
          style={{
            padding: '6px',
            borderRadius: '9999px',
            backgroundColor: theme.border,
            transition: 'background-color 0.2s',
          }}
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '9999px',
                backgroundColor: theme.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.primary,
              }}
            >
              <UserCircle2 className="w-6 h-6" />
            </button>

            {profileOpen && (
              <div
                style={{
                  backgroundColor: theme.background,
                  color: theme.foreground,
                  border: `1px solid ${theme.border}`,
                }}
                className="absolute right-0 mt-2 w-48 rounded-md shadow-md z-50"
              >
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:opacity-80"
                >
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <button
                  onClick={signOut}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:opacity-80"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth"
            style={{
              padding: '8px 16px',
              backgroundColor: theme.primary,
              color: '#fff',
              borderRadius: '6px',
            }}
          >
            Login
          </Link>
        )}
      </div>

      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={() => dispatch(toggleDarkMode())}
          style={{
            padding: '6px',
            borderRadius: '9999px',
            backgroundColor: theme.border,
          }}
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          style={{
            padding: '6px',
            borderRadius: '9999px',
            backgroundColor: theme.border,
          }}
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            backgroundColor: theme.background,
            color: theme.foreground,
            borderTop: `1px solid ${theme.border}`,
          }}
          className="absolute top-16 left-0 w-full shadow-lg z-40"
        >
          <div className="flex flex-col gap-4 px-6 py-4">
            <Link href="/about" onClick={() => setMenuOpen(false)} style={{ color: theme.foreground }}>About</Link>
            <Link href="/book" onClick={() => setMenuOpen(false)} style={{ color: theme.foreground }}>Book</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ color: theme.foreground }}>Contact</Link>
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} style={{ color: theme.foreground }}>My Profile</Link>
                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="text-left"
                  style={{ color: theme.foreground }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                style={{
                  backgroundColor: theme.primary,
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  textAlign: 'center',
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}