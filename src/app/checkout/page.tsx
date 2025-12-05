"use client";

import React, { useState } from "react";
import { ArrowLeft, CreditCard, User, MapPin, Phone, Mail, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Phone validation (Bangladeshi format)
    const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
    const cleanPhone = formData.phone.replace(/[\s\-]/g, ''); // Remove spaces and dashes
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = "Please enter a valid Bangladeshi phone number (e.g., +880 1XXX-XXXXXXXX)";
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Delivery address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    } else if (formData.address.trim().length > 200) {
      newErrors.address = "Address must be less than 200 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        deliveryAddress: formData.address,
        items: items,
        subtotal: subtotal,
        tax: tax,
        total: total + 50, // since you add delivery fee
        paymentMethod: paymentMethod === "cod" ? "cash" : "card",
        notes: formData.notes,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Failed to place order: " + data.error);
      return;
    }

    alert("Order placed successfully! Your order ID: " + data.orderId);

    clearCart();
    router.push("/");
  } catch (error) {
    console.error("Order error:", error);
    alert("Something went wrong while placing your order.");
  }
};

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Auto-format phone number
    value = value.replace(/\D/g, '');
    if (value.startsWith('880')) {
      value = '+' + value;
    } else if (value.startsWith('0')) {
      value = '+880' + value.substring(1);
    } else if (value.length > 0 && !value.startsWith('+')) {
      value = '+880' + value;
    }
    
    // Add spaces for readability
    if (value.length > 4) {
      value = value.substring(0, 4) + ' ' + value.substring(4);
    }
    if (value.length > 9) {
      value = value.substring(0, 9) + '-' + value.substring(9);
    }
    
    setFormData({ ...formData, phone: value });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <Card className="bg-neutral-800 border-neutral-700">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-neutral-300 mb-8">Add some items to your cart before checking out</p>
              <Link href="/">
                <Button className="bg-amber-600 hover:bg-amber-500 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Menu
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-amber-500" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-neutral-300">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-500"
                      />
                      {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-neutral-300">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-500"
                      />
                      {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-neutral-300">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+880 1XXX-XXXXXX"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                      className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-500"
                    />
                    {errors.phone && <p className="text-sm text-red-400">{errors.phone}</p>}
                    <p className="text-xs text-neutral-500">
                      Format: +880 1XXX-XXXXXX (Bangladeshi number)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-neutral-300">
                      <MapPin className="inline h-4 w-4 mr-2" />
                      Delivery Address *
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your full delivery address including house number, street, area, and city"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-500 min-h-[100px]"
                      maxLength={200}
                    />
                    <div className="flex justify-between">
                      {errors.address && <p className="text-sm text-red-400">{errors.address}</p>}
                      <p className="text-xs text-neutral-500 ml-auto">
                        {formData.address.length}/200 characters
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-neutral-300">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions for your order? (allergies, dietary restrictions, delivery instructions, etc.)"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-500"
                      maxLength={500}
                    />
                    <p className="text-xs text-neutral-500 text-right">
                      {formData.notes.length}/500 characters
                    </p>
                  </div>

                  <div className="pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-white">
                      <Wallet className="h-5 w-5 text-amber-500" />
                      Payment Method *
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={paymentMethod === "cod" ? "default" : "outline"}
                        className={paymentMethod === "cod" 
                          ? "bg-amber-600 hover:bg-amber-500 text-white" 
                          : "border-neutral-600 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                        }
                        onClick={() => setPaymentMethod("cod")}
                      >
                        Cash on Delivery
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === "card" ? "default" : "outline"}
                        className={paymentMethod === "card" 
                          ? "bg-amber-600 hover:bg-amber-500 text-white" 
                          : "border-neutral-600 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                        }
                        onClick={() => setPaymentMethod("card")}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Credit Card
                      </Button>
                    </div>
                    <p className="text-sm text-neutral-400 mt-2">
                      {paymentMethod === "cod" 
                        ? "Pay with cash when your order arrives" 
                        : "You will be redirected to secure payment gateway"
                      }
                    </p>
                  </div>

                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-6 text-lg">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Place Order - BDT {(total + 50).toFixed(2)}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-neutral-800 border-neutral-700 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-neutral-400">
                          {item.qty} × BDT {item.price}
                        </p>
                      </div>
                      <p className="font-semibold text-white">BDT {(item.qty * item.price).toFixed(2)}</p>
                    </div>
                  ))}

                  <Separator className="bg-neutral-700" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-300">Subtotal</span>
                      <span className="text-white">BDT {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-300">Tax (5%)</span>
                      <span className="text-white">BDT {tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-300">Delivery Fee</span>
                      <span className="text-white">BDT 50.00</span>
                    </div>
                  </div>

                  <Separator className="bg-neutral-700" />

                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-amber-400">BDT {(total + 50).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}