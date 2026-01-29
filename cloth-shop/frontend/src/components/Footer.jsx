import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg shadow-white/10 group-hover:shadow-white/30 transition-all duration-300 group-hover:scale-105">
                  <span className="text-slate-900 font-bold text-xl">P</span>
                </div>
                <div className="absolute -inset-1 bg-white rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity -z-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">POGIEE</h3>
                <p className="text-xs text-amber-400/80 font-medium tracking-widest uppercase">Premium Fashion</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Discover curated collections of premium clothing and accessories. Where elegance meets contemporary style.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-amber-500 hover:to-amber-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-amber-500/25 hover:scale-110 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-amber-500 to-transparent" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'New Arrivals', path: '/shop' },
                { name: 'Collections', path: '/shop' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '#' }
              ].map((link) => (
                <li key={link.name}>
                  {link.path.startsWith('/') ? (
                    <Link
                      to={link.path}
                      className="text-gray-400 text-sm hover:text-amber-400 transition-all duration-300 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-amber-400 group-hover:w-4 transition-all duration-300" />
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.path}
                      className="text-gray-400 text-sm hover:text-amber-400 transition-all duration-300 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-amber-400 group-hover:w-4 transition-all duration-300" />
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-amber-500 to-transparent" />
              Customer Care
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Track Order', path: '/orders' },
                { name: 'Returns & Exchange', path: '#' },
                { name: 'Shipping Info', path: '#' },
                { name: 'Size Guide', path: '#' },
                { name: 'FAQ', path: '#' }
              ].map((link) => (
                <li key={link.name}>
                  {link.path.startsWith('/') ? (
                    <Link
                      to={link.path}
                      className="text-gray-400 text-sm hover:text-amber-400 transition-all duration-300 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-amber-400 group-hover:w-4 transition-all duration-300" />
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.path}
                      className="text-gray-400 text-sm hover:text-amber-400 transition-all duration-300 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-amber-400 group-hover:w-4 transition-all duration-300" />
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-amber-500 to-transparent" />
              Stay Updated
            </h4>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              Join our exclusive list for early access to new collections and special offers.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold px-6 py-3 rounded-xl hover:from-amber-400 hover:to-amber-500 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-900 px-4 text-gray-600 text-xs">✦</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 <span className="text-gray-400">POGIEE</span>. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-gray-500 text-sm hover:text-amber-400 transition-all duration-300"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Made with</span>
            <span className="text-red-500 animate-pulse">♥</span>
            <span>for fashion lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
