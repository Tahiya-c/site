"use client";

import React, { useState } from "react";
import {
  ChevronRight, Phone, Mail, MapPin,
  Star, Flame, Utensils, Users, Lightbulb, Sofa, Calendar, CheckCircle, 
  ArrowRight, Menu, X, ChevronDown, ChevronUp
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CartSheet } from "@/components/cart/CartSheet";
import { useCartStore } from "@/store/cartStore";
import { menuItems as fullMenuItems } from "@/data/menu";

import ReservationForm from "./reservations/ReservationForm";
import CompactMenuSection from "@/components/CompactMenuSection";


// ------------------------------------
// REUSABLE HELPERS
// ------------------------------------
const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const ReservationDialog = ({ children }: { children: React.ReactNode }) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="bg-neutral-900 border-neutral-800 max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-2xl text-amber-600">Make a Reservation</DialogTitle>
        <DialogDescription className="text-neutral-400">
          Book your table at Club Grille for an unforgettable dining experience.
        </DialogDescription>
      </DialogHeader>
      <ReservationForm />
    </DialogContent>
  </Dialog>
);

// ------------------------------------
// STATIC DATA
// ------------------------------------
const atmosphereFeatures = [
  {
    icon: Lightbulb,
    title: "Warm Ambient Lighting",
    description: "Soft Edison bulbs and indirect lighting create an inviting, cozy atmosphere perfect for any occasion.",
  },
  {
    icon: Sofa,
    title: "Premium Comfort",
    description: "Plush leather seating and thoughtfully designed spaces ensure your complete comfort.",
  },
  {
    icon: Users,
    title: "Perfect for Groups",
    description: "Tables for two or spacious seating for celebrations with friends and family.",
  },
];

// UPDATED: Removed "Gallery" and "Reviews" from quickLinks
const quickLinks = ["Home", "About Us", "Menu"];

const badgeMap = {
  bestseller: "Best Seller",
  premium: "Premium",
  popular: "Popular",
} as const;

const badgeColorMap = {
  bestseller: "bg-green-600",
  premium: "bg-amber-600",
  popular: "bg-blue-600",
} as const;

// ------------------------------------
// NAVBAR COMPONENT
// ------------------------------------
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalCount = useCartStore((state) => state.totalCount);

  return (
    <nav className="fixed top-0 w-full bg-black/80 text-white z-50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wide">
            CLUB <span className="text-amber-600">GRILLE</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {/* UPDATED: Removed "gallery" from navigation */}
          {["home", "about", "menu", "reservations"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="hover:text-amber-600 transition-colors font-medium"
              onClick={(e) => {
                e.preventDefault();
                scrollTo(id);
              }}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}

          <div className="relative">
            <CartSheet />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            )}
          </div>
          
          <ReservationDialog>
            <Button className="bg-red-800 hover:bg-red-700">Reserve Now</Button>
          </ReservationDialog>
        </div>

        <div className="flex md:hidden items-center gap-4">
          <div className="relative">
            <CartSheet />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10 p-4 space-y-4">
          {/* UPDATED: Removed "gallery" from mobile navigation */}
          {["home", "about", "menu", "reservations"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="block hover:text-amber-600 transition-colors py-2"
              onClick={(e) => {
                e.preventDefault();
                scrollTo(id);
                setIsMobileMenuOpen(false);
              }}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
          
          <Separator className="bg-neutral-800" />
          
          <ReservationDialog>
            <Button className="bg-red-800 hover:bg-red-700 w-full">Reserve Table</Button>
          </ReservationDialog>
        </div>
      )}
    </nav>
  );
};

// ------------------------------------
// MAIN COMPONENT
// ------------------------------------
export default function RestaurantWebsite() {
  const { addItem } = useCartStore();
  const [showAll, setShowAll] = useState(false);

  const handleAddToCart = (item: typeof fullMenuItems[number]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || "",
      qty: 1,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
      <Navbar />

      {/* HERO SECTION - SHADOW SEPARATION */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Image with shadow separation */}
        <div className="absolute right-0 top-0 bottom-0 w-[30%] hidden md:block">
          <div className="relative h-full w-full">
            <div className="absolute -left-8 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent shadow-2xl"></div>
            <img
              src="/menu/firstpic.png"
              alt="Club Grille Premium Steak"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="max-w-xl lg:max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Separator className="w-12 bg-amber-600" />
              <p className="text-amber-600 uppercase tracking-wider text-sm font-bold">
                UPSCALE STEAKHOUSE IN CHATTOGRAM
              </p>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Where Steaks Meet<br />
              <span className="text-amber-600">Style</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-neutral-300 mb-10 leading-relaxed">
              Experience premium cuts and cozy industrial ambiance. Perfectly grilled steaks, warm lighting, and a modern atmosphere that transforms every meal into a memorable occasion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <ReservationDialog>
                <Button size="lg" className="bg-red-800 hover:bg-red-700 text-lg px-8 py-6">
                  Reserve Your Table <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </ReservationDialog>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-amber-700 text-amber-700 hover:bg-amber-700/20 text-lg px-8 py-6"
                onClick={() => scrollTo("menu")}
              >
                Explore Our Menu
              </Button>
            </div>

            <div className="flex items-center gap-3 text-neutral-400">
              <CheckCircle className="h-5 w-5 text-amber-600" />
              <span>Walk-ins welcome • Easy online reservations</span>
            </div>
          </div>
        </div>
      </section>

      {/* MENU SECTION - SHOW ONLY FIRST 6 ITEMS */}
      <section id="menu" className="py-16 sm:py-24 bg-gradient-to-b from-neutral-900 to-red-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-amber-600 uppercase tracking-wider text-sm font-semibold mb-3">SIGNATURE OFFERINGS</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Perfectly Grilled, <span className="text-amber-600">Unforgettable</span>
            </h2>
            <p className="text-neutral-300 text-lg max-w-3xl mx-auto">
              Every steak is a masterpiece. Expertly prepared, beautifully presented, and served in an 
              atmosphere designed for memorable moments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {fullMenuItems
              .filter(item => item.image)
              .slice(0, showAll ? undefined : 6)
              .map((item) => (
                <Card 
                  key={item.id}
                  className="group bg-neutral-800 border-neutral-700 hover:shadow-amber-900/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  {/* BADGE */}
                  {item.badge && (
                    <div className={`absolute top-4 right-4 z-10 ${badgeColorMap[item.badge]} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                      {badgeMap[item.badge]}
                    </div>
                  )}

                  {/* IMAGE DISPLAY */}
                  <div className="relative h-48 sm:h-64 overflow-hidden bg-neutral-900">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.fallback-icon')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'fallback-icon absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-900 to-neutral-900';
                            fallback.innerHTML = '<svg class="h-24 w-24 text-amber-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-900 to-neutral-900">
                        <Utensils className="h-24 w-24 text-amber-600 opacity-50" />
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    {/* FIXED: Changed CardTitle text color from default black to white */}
                    <CardTitle className="text-2xl mb-2 text-white">
                      {item.name}
                    </CardTitle>
                    <p className="text-amber-600 font-bold text-lg mb-3">BDT {item.price}</p>
                    {/* FIXED: Changed CardDescription from black to neutral-400 */}
                    <CardDescription className="text-neutral-400 mb-4">
                      {item.description}
                    </CardDescription>
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-2">
                        {item.category === 'steak' ? (
                          <Flame className="h-5 w-5 text-amber-600" />
                        ) : item.category === 'chicken' ? (
                          <Star className="h-5 w-5 text-amber-600" />
                        ) : (
                          <Utensils className="h-5 w-5 text-amber-600" />
                        )}
                        {/* FIXED: Changed category text from black to white */}
                        <span className="font-semibold text-white">
                          {item.category === 'steak' ? 'Signature' : 
                          item.category === 'chicken' ? 'Popular' : 'Premium'}
                        </span>
                      </div>
                      <Button 
                        className="bg-amber-700 hover:bg-amber-600"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {fullMenuItems.filter(item => item.image).length > 6 && (
            <div className="text-center mt-8 sm:mt-12">
              <Button 
                size="lg" 
                className="bg-red-800 hover:bg-red-700 px-8 py-6"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : 'View Full Menu'} 
                {showAll ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* COMPACT MENU - Items without images */}
      <CompactMenuSection 
        menuItems={fullMenuItems}
        onAddToCart={handleAddToCart}
      />

      {/* ATMOSPHERE SECTION */}
      <section id="about" className="py-16 sm:py-24 bg-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <p className="text-amber-600 uppercase tracking-wider text-sm font-semibold mb-3">MODERN INDUSTRIAL ELEGANCE</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                An Atmosphere That <span className="text-amber-600">Captivates</span>
              </h2>
              <p className="text-neutral-300 text-lg mb-8">
                Step into a world where warm Edison bulbs cast a cozy glow over leather banquettes 
                and exposed brick walls. Our industrial-chic design creates the perfect backdrop for 
                intimate dinners, celebrations, and unforgettable moments.
              </p>

              <div className="space-y-6 mb-8">
                {atmosphereFeatures.map((feature, index) => (
                  <Card key={index} className="bg-neutral-700/50 border-neutral-700">
                    <CardContent className="p-6">
                      <div className="flex gap-4 items-start">
                        <div className="bg-red-800 p-3 rounded-full flex-shrink-0">
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl mb-2 text-white">{feature.title}</h3>
                          <p className="text-neutral-400">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button 
                className="bg-amber-700 hover:bg-amber-600 px-8 py-6"
                onClick={() => scrollTo("about")}
              >
                Discover Our Story <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-xl">
                <img 
                  src="/menu/ambience.webp" 
                  alt="Club Grille Restaurant Ambience"
                  className="w-full h-[400px] sm:h-[600px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-6 right-6">
                  <div className="inline-flex items-center gap-2 bg-black/80 backdrop-blur-sm px-4 py-3 rounded-full">
                    <Star className="h-5 w-5 text-amber-600" />
                    <span className="text-2xl font-bold text-white">5★</span>
                    <span className="text-sm text-neutral-300 ml-2">Highly Rated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="reservations" className="py-16 sm:py-24 bg-gradient-to-br from-neutral-800 via-neutral-900 to-red-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Card className="bg-transparent border-0">
            <CardContent className="p-6">
              <div className="w-20 h-20 bg-amber-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Utensils className="h-10 w-10" />
              </div>
              <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready for an <span className="text-amber-600">Unforgettable</span><br />
                Dining Experience?
              </CardTitle>
              <CardDescription className="text-lg sm:text-xl text-neutral-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
                Reserve your table today and discover why Club Grille is Chattogram's premier 
                destination for exceptional steaks and memorable moments.
              </CardDescription>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12">
                <ReservationDialog>
                  <Button size="lg" className="bg-amber-700 hover:bg-amber-600 px-8 py-6">
                    Reserve Your Table <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </ReservationDialog>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 hover:bg-white/10 px-8 py-6"
                  onClick={() => scrollTo("menu")}
                >
                  View Menu
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm">
                {['Walk-ins Welcome', 'Group Reservations Available', 'Private Events'].map((item) => (
                  <div key={item} className="flex items-center gap-2 justify-center">
                    <CheckCircle className="h-5 w-5 text-amber-600" />
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER - UPDATED */}
      <footer className="bg-neutral-950 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CLUB GRILLE</span>
              </div>
              <p className="text-neutral-400 mb-6">
                Where steaks meet style. Experience premium cuts in a cozy, modern industrial atmosphere.
              </p>
              {/* REMOVED: Social media icons */}
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Quick Links</h3>
              <ul className="space-y-3 text-neutral-400">
                {/* UPDATED: Removed "Gallery" and "Reviews" */}
                {quickLinks.map((item) => (
                  <li key={item}>
                    <a 
                      href={`#${item.toLowerCase().replace(' ', '')}`} 
                      className="hover:text-amber-600 transition-colors flex items-center gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        const targetId = item === 'Home' ? 'home' : item.toLowerCase().replace(' ', '');
                        scrollTo(targetId);
                      }}
                    >
                      <ChevronRight className="h-4 w-4" /> 
                      <span className="text-white">{item}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Contact Info</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                  <span className="text-white">
                    Rahim's Plaza de CPDL<br />Chattogram, Bangladesh
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-amber-600" />
                  <span className="text-white">+880 1234-567890</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-amber-600" />
                  <span className="text-white">info@clubgrille.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Opening Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">Mon - Thu:</span>
                  <span className="text-amber-600 font-semibold">12PM - 11PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Fri - Sun:</span>
                  <span className="text-amber-600 font-semibold">12PM - 12AM</span>
                </div>
                <ReservationDialog>
                  <Button className="w-full bg-red-800 hover:bg-red-700 mt-4">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Now
                  </Button>
                </ReservationDialog>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-800 mb-8" />
          <div className="text-center text-neutral-500 text-sm">
            <p>&copy; 2024 Club Grille. All rights reserved. Crafted with passion for exceptional dining.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}