"use client";

import React, { useState } from "react";
import {
  ChevronRight, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle,
  Star, Flame, Utensils, Users, Lightbulb, Sofa, Calendar, CheckCircle, ArrowRight, Menu, X, ShoppingCart
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/cart/CartSheet";
import { useCartStore } from "@/store/cartStore";
import { menuItems as fullMenuItems } from "@/data/menu";
import Link from "next/link";

import ReservationForm from "./reservations/ReservationForm";
// ------------------------------------
// REUSABLE HELPERS
// ------------------------------------
const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

// UPDATED: ReservationDialog now uses the actual ReservationForm component
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
      {/* REPLACED: Now using the actual ReservationForm component */}
      <ReservationForm />
    </DialogContent>
  </Dialog>
);

// ------------------------------------
// STATIC DATA (outside component)
// ------------------------------------
const galleryImages = [
  { type: "image", label: "Meat Heaven - BDT 1830" },
  { type: "image", label: "Signature Platter" },
  { type: "video", label: "0:07" },
  { type: "image", label: "Grilled Specialties" },
  { type: "image", label: "Refreshing Drinks" },
];

const atmosphereFeatures = [
  {
    icon: Lightbulb,
    title: "Warm Ambient Lighting",
    description:
      "Soft Edison bulbs and indirect lighting create an inviting, cozy atmosphere perfect for any occasion.",
  },
  {
    icon: Sofa,
    title: "Premium Comfort",
    description:
      "Plush leather seating and thoughtfully designed spaces ensure your complete comfort.",
  },
  {
    icon: Users,
    title: "Perfect for Groups",
    description:
      "Tables for two or spacious seating for celebrations with friends and family.",
  },
];

const quickLinks = ["Home", "About Us", "Menu", "Gallery", "Reviews"];

// Map icon names to actual components
const iconMap = {
  Flame: Flame,
  Star: Star,
  Utensils: Utensils,
} as const;

// Map badge types to display text
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
// INTEGRATED NAVBAR COMPONENT
// ------------------------------------
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalCount = useCartStore((state) => state.totalCount);

  return (
    <nav className="fixed top-0 w-full bg-black/80 text-white z-50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wide">
            CLUB <span className="text-amber-600">GRILLE</span>
          </span>
        </div>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-6">
          {["home", "about", "menu", "gallery", "reservations"].map((id) => (
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

          {/* DESKTOP CART */}
          <div className="relative">
            <CartSheet />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            )}
          </div>
          
          {/* RESERVATION BUTTON - Uses ReservationDialog */}
          <ReservationDialog>
            <Button className="bg-red-800 hover:bg-red-700">
              Reserve Now
            </Button>
          </ReservationDialog>
        </div>

        {/* MOBILE MENU + CART */}
        <div className="flex md:hidden items-center gap-4">
          {/* MOBILE CART */}
          <div className="relative">
            <CartSheet />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10 p-4 space-y-4">
          {["home", "about", "menu", "gallery", "reservations"].map((id) => (
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
          
          {/* MOBILE RESERVATION BUTTON - Uses ReservationDialog */}
          <ReservationDialog>
            <Button className="bg-red-800 hover:bg-red-700 w-full">
              Reserve Table
            </Button>
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

  const handleAddToCart = (item: typeof fullMenuItems[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || "",
      qty: 1,
    });
  };

  const displayMenuItems = fullMenuItems.map((item) => ({
    ...item,
    icon: iconMap[item.id === 'sirloin' ? 'Flame' : item.id === 'striploin' ? 'Star' : 'Utensils'],
    tag: item.category === 'steaks' ? 'Signature' : item.category === 'chicken' ? 'Popular' : 'Premium',
  }));

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
      
      {/* INTEGRATED NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center justify-start pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-amber-950/30 to-neutral-800 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-32 w-full">
          <div className="max-w-2xl">
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
            
            <p className="text-lg sm:text-xl text-neutral-300 mb-10 leading-relaxed max-w-xl">
              Experience premium cuts and cozy industrial ambiance. Perfectly grilled steaks, warm lighting, and a modern atmosphere that transforms every meal into a memorable occasion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* HERO RESERVATION BUTTON - Uses ReservationDialog */}
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

      {/* MENU SECTION */}
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
            {displayMenuItems.map((item) => (
              <Card 
                key={item.id}
                className="group bg-neutral-800 border-neutral-700 hover:shadow-amber-900/20 transition-all duration-300 hover:-translate-y-2"
              >
                {item.badge && (
                  <div className={`absolute top-4 right-4 z-10 ${badgeColorMap[item.badge]} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {badgeMap[item.badge]}
                  </div>
                )}
                <CardHeader>
                  <div className="h-48 sm:h-64 bg-gradient-to-br from-amber-900 to-neutral-900 rounded-t-lg flex items-center justify-center">
                    <item.icon className="h-24 w-24 text-amber-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-2xl mb-2">{item.name}</CardTitle>
                  <p className="text-amber-600 font-bold text-lg mb-3">BDT {item.price}</p>
                  <CardDescription className="text-neutral-400 mb-4">
                    {item.description}
                  </CardDescription>
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-5 w-5 text-amber-600" />
                      <span className="font-semibold">{item.tag}</span>
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

          <div className="text-center mt-8 sm:mt-12">
            <Button 
              size="lg" 
              className="bg-red-800 hover:bg-red-700 px-8 py-6"
              onClick={() => scrollTo("menu")}
            >
              View Full Menu <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

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
                          <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
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
              <Card className="bg-gradient-to-br from-amber-900 to-neutral-900 border-0 h-[400px] sm:h-[600px] flex items-center justify-center">
                <CardContent className="text-center p-8 sm:p-12">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-3 bg-red-900/80 px-6 py-3 rounded-full">
                      <Star className="h-6 w-6 text-amber-600" />
                      <span className="text-3xl font-bold">5★</span>
                    </div>
                  </div>
                  <p className="text-xl font-semibold">Highly Rated</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="py-16 sm:py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-amber-600 uppercase tracking-wider text-sm font-semibold mb-3">INSTAGRAM GALLERY</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Feast Your <span className="text-amber-600">Eyes</span>
            </h2>
            <p className="text-neutral-300 text-lg">
              See what our guests are enjoying. Follow us @clubgrille
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {galleryImages.map((item, index) => (
              <Card 
                key={index} 
                className="group aspect-square bg-gradient-to-br from-amber-900 to-neutral-900 border-0 cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <CardContent className="p-4 h-full flex items-center justify-center">
                  {item.type === "video" ? (
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 mx-auto">
                        <div className="w-0 h-0 border-t-4 sm:border-t-8 border-t-transparent border-l-6 sm:border-l-12 border-l-white border-b-4 sm:border-b-8 border-b-transparent ml-1"></div>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold bg-black/50 px-2 sm:px-3 py-1 rounded-full">{item.label}</span>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <Utensils className="h-8 w-8 sm:h-12 sm:w-12 text-amber-600 mx-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                      <p className="text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">{item.label}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-neutral-400 mb-4">Share your experience with #ClubGrille</p>
            <Button 
              variant="link" 
              className="text-amber-600 font-semibold hover:text-amber-500"
              onClick={() => scrollTo("gallery")}
            >
              View More on Instagram <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
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
              <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Ready for an <span className="text-amber-600">Unforgettable</span><br />
                Dining Experience?
              </CardTitle>
              <CardDescription className="text-lg sm:text-xl text-neutral-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
                Reserve your table today and discover why Club Grille is Chattogram's premier 
                destination for exceptional steaks and memorable moments.
              </CardDescription>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12">
                {/* CTA RESERVATION BUTTON - Uses ReservationDialog */}
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
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-950 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            {/* Logo & Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">CLUB GRILLE</span>
              </div>
              <p className="text-neutral-400 mb-6">
                Where steaks meet style. Experience premium cuts in a cozy, modern industrial atmosphere.
              </p>
              <div className="flex gap-3">
                {[Facebook, Instagram, MessageCircle].map((Icon, index) => (
                  <Button key={index} size="icon" className="bg-red-800 hover:bg-red-700 rounded-full">
                    <Icon className="h-5 w-5" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3 text-neutral-400">
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
                      <ChevronRight className="h-4 w-4" /> {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Info</h3>
              <ul className="space-y-4 text-neutral-400">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                  <span>Rahim's Plaza de CPDL<br />Chattogram, Bangladesh</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-amber-600" />
                  <span>+880 1234-567890</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-amber-600" />
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
                {/* FOOTER RESERVATION BUTTON - Uses ReservationDialog */}
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