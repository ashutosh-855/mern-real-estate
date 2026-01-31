import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHome, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-xl">
                                <span className="text-white font-bold text-xl">E</span>
                            </div>
                            <h1 className="font-extrabold text-2xl tracking-tight text-white">
                                Doheera<span className="text-gold-accent">Estate</span>
                            </h1>
                        </Link>
                        <p className="text-slate-400 leading-relaxed">
                            Redefining the real estate experience with luxury, trust, and modern technology. Find your sanctuary with us.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                                <FaFacebook className="text-lg" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                                <FaTwitter className="text-lg" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                                <FaInstagram className="text-lg" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                                <FaLinkedin className="text-lg" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Explore</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="hover:text-gold-accent transition-colors">Home</Link></li>
                            <li><Link to="/search" className="hover:text-gold-accent transition-colors">Properties</Link></li>
                            <li><Link to="/search?type=rent" className="hover:text-gold-accent transition-colors">Rentals</Link></li>
                            <li><Link to="/search?type=sale" className="hover:text-gold-accent transition-colors">Sales</Link></li>
                            <li><Link to="/about" className="hover:text-gold-accent transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-gold-accent transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-gold-accent transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-gold-accent transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-gold-accent transition-colors">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <FaHome className="text-gold-accent mt-1" />
                                <span>123 Elite Plaza, Bangalore, KA, 560001, India</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <FaEnvelope className="text-gold-accent" />
                                <span>contact@doheera.estate</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <FaPhone className="text-gold-accent" />
                                <span>+91 1800 123 4567</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Doheera Estate. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-slate-500">
                        <a href="#" className="hover:text-slate-300">Privacy</a>
                        <a href="#" className="hover:text-slate-300">Policy</a>
                        <a href="#" className="hover:text-slate-300">Credits</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
