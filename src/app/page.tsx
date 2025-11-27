"use client";

import React, { useState } from 'react';
import { ChevronRight, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, Star, Flame, Utensils, Users, Lightbulb, Sofa, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

export default function RestaurantWebsite() {
  const [activeImage, setActiveImage] = useState(0);
  
  const galleryImages = [
    { type: 'image', label: 'Meat Heaven - BDT 1830' },
    { type: 'image', label: 'Signature Platter' },
    { type: 'video', label: '0:07', thumb: 'Cooking Video' },
    { type: 'image', label: 'Grilled Specialties' },
    { type: 'image', label: 'Refreshing Drinks' },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-neutral-900/95 backdrop-blur-sm z-50 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">CLUB <span className="text-amber-600">GRILLE</span></span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#about" className="hover:text-amber-600 transition-colors font-medium">About Us</a>
            <a href="#menu" className="hover:text-amber-600 transition-colors font-medium">Menu</a>
            <a href="#gallery" className="hover:text-amber-600 transition-colors font-medium">Gallery</a>
            <a href="#reservations" className="hover:text-amber-600 transition-colors font-medium">Reservations</a>
            <button className="bg-red-800 hover:bg-red-700 px-6 py-2.5 rounded-md font-semibold transition-colors">
              Reserve Your Table Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Width with Background Image */}
      <section id="home" className="relative min-h-screen flex items-center justify-start pt-20">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-0"></div>
        
        {/* Background Pattern/Image Simulation */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-amber-950/30 to-neutral-800 z-0">
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
        </div>

        {/* Simulated Steak Image on Right */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Steak Illustration */}
            <div className="relative">
              <div className="w-96 h-96 bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 rounded-full blur-3xl opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Flame className="w-64 h-64 text-amber-600/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
            <p className="text-amber-600 uppercase tracking-wider text-sm font-bold mb-4 flex items-center gap-2">
              <span className="w-12 h-0.5 bg-amber-600"></span>
              UPSCALE STEAKHOUSE IN CHATTOGRAM
            </p>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Where Steaks Meet<br />
              <span className="text-amber-600">Style</span>
            </h1>
            
            <p className="text-xl text-neutral-300 mb-10 leading-relaxed max-w-xl">
              Experience premium cuts and cozy industrial ambiance. Perfectly grilled steaks, warm lighting, and a modern atmosphere that transforms every meal into a memorable occasion.
            </p>
            
            <div className="flex gap-4 flex-wrap mb-8">
              <button className="bg-red-800 hover:bg-red-700 px-8 py-4 rounded-md font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-xl">
                Reserve Your Table <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-amber-700/20 border-2 border-amber-700 hover:bg-amber-700 px-8 py-4 rounded-md font-semibold text-lg transition-all transform hover:scale-105">
                Explore Our Menu
              </button>
            </div>

            <div className="flex items-center gap-3 text-neutral-400">
              <CheckCircle className="w-5 h-5 text-amber-600" />
              <span>Walk-ins welcome • Easy online reservations</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-sm text-neutral-400">Scroll to explore</span>
            <ChevronRight className="w-6 h-6 text-amber-600 rotate-90" />
          </div>
        </div>
      </section>

      {/* Signature Offerings Section */}
      <section id="menu" className="py-24 bg-gradient-to-b from-neutral-900 to-red-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-amber-600 uppercase tracking-wider text-sm font-semibold mb-3">SIGNATURE OFFERINGS</p>
            <h2 className="text-5xl font-bold mb-4">
              Perfectly Grilled, <span className="text-amber-600">Unforgettable</span>
            </h2>
            <p className="text-neutral-300 text-lg max-w-3xl mx-auto">
              Every steak is a masterpiece. Expertly prepared, beautifully presented, and served in an 
              atmosphere designed for memorable moments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Premium Sirloin Steak */}
            <div className="bg-neutral-800 rounded-lg overflow-hidden shadow-2xl hover:shadow-amber-900/20 transition-all duration-300 transform hover:-translate-y-2 relative group">
              <div className="absolute top-4 right-4 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Best Seller
              </div>
              <div className="h-64 bg-gradient-to-br from-amber-900 to-neutral-900 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <Flame className="w-24 h-24 text-amber-600 mx-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Premium Sirloin Steak</h3>
                <p className="text-neutral-400 mb-4">
                  Perfectly aged, char-grilled to your preference, served with roasted vegetables and signature sauce.
                </p>
                <div className="flex items-center gap-2 text-red-500">
                  <Flame className="w-5 h-5" />
                  <span className="font-semibold">Signature</span>
                </div>
              </div>
            </div>

            {/* Striploin Perfection */}
            <div className="bg-neutral-800 rounded-lg overflow-hidden shadow-2xl hover:shadow-amber-900/20 transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="h-64 bg-gradient-to-br from-red-900 to-neutral-900 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <Star className="w-24 h-24 text-amber-600 mx-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Striploin Perfection</h3>
                <p className="text-neutral-400 mb-4">
                  Tender, juicy cuts expertly seasoned and grilled. A favorite among steak and wine enthusiasts.
                </p>
                <div className="flex items-center gap-2 text-amber-600">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">Premium</span>
                </div>
              </div>
            </div>

            {/* Signature Chicken */}
            <div className="bg-neutral-800 rounded-lg overflow-hidden shadow-2xl hover:shadow-amber-900/20 transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="h-64 bg-gradient-to-br from-amber-900 to-neutral-900 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <Utensils className="w-24 h-24 text-amber-600 mx-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Signature Chicken</h3>
                <p className="text-neutral-400 mb-4">
                  Perfectly seasoned and pan-seared chicken with bold flavors, lime, and aromatic spices.
                </p>
                <div className="flex items-center gap-2 text-green-500">
                  <Utensils className="w-5 h-5" />
                  <span className="font-semibold">Popular</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-red-800 hover:bg-red-700 px-8 py-4 rounded-md font-semibold text-lg transition-colors inline-flex items-center gap-2">
              View Full Menu <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Atmosphere Section */}
      <section id="about" className="py-24 bg-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-600 uppercase tracking-wider text-sm font-semibold mb-3">MODERN INDUSTRIAL ELEGANCE</p>
              <h2 className="text-5xl font-bold mb-6">
                An Atmosphere That <span className="text-amber-600">Captivates</span>
              </h2>
              <p className="text-neutral-300 text-lg mb-8">
                Step into a world where warm Edison bulbs cast a cozy glow over leather banquettes 
                and exposed brick walls. Our industrial-chic design creates the perfect backdrop for 
                intimate dinners, celebrations, and unforgettable moments.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-red-800 p-3 rounded-full flex-shrink-0">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Warm Ambient Lighting</h3>
                    <p className="text-neutral-400">
                      Soft Edison bulbs and indirect lighting create an inviting, cozy atmosphere perfect for any occasion.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-red-800 p-3 rounded-full flex-shrink-0">
                    <Sofa className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Premium Comfort</h3>
                    <p className="text-neutral-400">
                      Plush leather seating and thoughtfully designed spaces ensure your complete comfort.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-red-800 p-3 rounded-full flex-shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Perfect for Groups</h3>
                    <p className="text-neutral-400">
                      Intimate tables for two or spacious seating for celebrations with friends and family.
                    </p>
                  </div>
                </div>
              </div>

              <button className="bg-amber-700 hover:bg-amber-600 px-8 py-3 rounded-md font-semibold transition-colors inline-flex items-center gap-2">
                Discover Our Story <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-amber-900 to-neutral-900 rounded-lg h-[600px] flex items-center justify-center overflow-hidden shadow-2xl">
                <div className="text-center p-12">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-3 bg-red-900/80 px-6 py-3 rounded-full">
                      <Star className="w-6 h-6 text-amber-600" />
                      <span className="text-3xl font-bold">5★</span>
                    </div>
                  </div>
                  <p className="text-xl font-semibold">Highly Rated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-amber-600 uppercase tracking-wider text-sm font-semibold mb-3">INSTAGRAM GALLERY</p>
            <h2 className="text-5xl font-bold mb-4">
              Feast Your <span className="text-amber-600">Eyes</span>
            </h2>
            <p className="text-neutral-300 text-lg">
              See what our guests are enjoying. Follow us @clubgrille
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {galleryImages.map((item, index) => (
              <div 
                key={index} 
                className="aspect-square bg-gradient-to-br from-amber-900 to-neutral-900 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 relative group"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {item.type === 'video' ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 mx-auto">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                      </div>
                      <span className="text-sm font-semibold bg-black/50 px-3 py-1 rounded-full">{item.label}</span>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <Utensils className="w-12 h-12 text-amber-600 mx-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                      <p className="text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">{item.label}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-neutral-400 mb-4">Share your experience with #ClubGrille</p>
            <button className="text-amber-600 font-semibold hover:text-amber-500 transition-colors inline-flex items-center gap-2">
              View More on Instagram <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="reservations" className="py-24 bg-gradient-to-br from-neutral-800 via-neutral-900 to-red-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-amber-700 rounded-full flex items-center justify-center mx-auto">
              <Utensils className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready for an <span className="text-amber-600">Unforgettable</span><br />
            Dining Experience?
          </h2>
          <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
            Reserve your table today and discover why Club Grille is Chattogram's premier 
            destination for exceptional steaks and memorable moments.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <button className="bg-amber-700 hover:bg-amber-600 px-8 py-4 rounded-md font-semibold text-lg transition-colors inline-flex items-center gap-2">
              Reserve Your Table <ChevronRight className="w-5 h-5" />
            </button>
            <button className="border border-white/30 hover:bg-white/10 px-8 py-4 rounded-md font-semibold text-lg transition-colors">
              View Menu
            </button>
          </div>

          <div className="flex justify-center gap-8 flex-wrap text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-amber-600" />
              <span>Walk-ins Welcome</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-amber-600" />
              <span>Group Reservations Available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-amber-600" />
              <span>Private Events</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Logo & Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CLUB GRILLE</span>
              </div>
              <p className="text-neutral-400 mb-6">
                Where steaks meet style. Experience premium cuts in a cozy, modern industrial atmosphere.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-red-800 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-red-800 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-red-800 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3 text-neutral-400">
                <li><a href="#home" className="hover:text-amber-600 transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Home</a></li>
                <li><a href="#about" className="hover:text-amber-600 transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> About Us</a></li>
                <li><a href="#menu" className="hover:text-amber-600 transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Menu</a></li>
                <li><a href="#gallery" className="hover:text-amber-600 transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Gallery</a></li>
                <li><a href="#" className="hover:text-amber-600 transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Reviews</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Info</h3>
              <ul className="space-y-4 text-neutral-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                  <span>Rahim's Plaza de CPDL<br />Chattogram, Bangladesh</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-600" />
                  <span>+880 1234-567890</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-600" />
                  <span>info@clubgrille.com</span>
                </li>
              </ul>
            </div>

            {/* Opening Hours */}
            <div>
              <h3 className="font-bold text-lg mb-4">Opening Hours</h3>
              <div className="space-y-3 text-neutral-400">
                <div className="flex justify-between items-center">
                  <span>Mon - Thu:</span>
                  <span className="text-amber-600 font-semibold">12PM - 11PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fri - Sun:</span>
                  <span className="text-amber-600 font-semibold">12PM - 12AM</span>
                </div>
                <button className="w-full bg-red-800 hover:bg-red-700 px-4 py-3 rounded-md font-semibold transition-colors mt-4 flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Now
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 text-center text-neutral-500 text-sm">
            <p>&copy; 2024 Club Grille. All rights reserved. Crafted with passion for exceptional dining.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}