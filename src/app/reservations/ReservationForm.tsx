"use client";

import React, { useState } from "react";
import { Calendar, Clock, Users, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReservationData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  specialRequests?: string;
}

export default function ReservationForm() {
  const [formData, setFormData] = useState<ReservationData>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    specialRequests: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          date: formData.date,
          time: formData.time,
          guests: parseInt(formData.guests),
          specialRequests: formData.specialRequests || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create reservation");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "",
        specialRequests: "",
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
    "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM",
    "10:00 PM", "10:30 PM", "11:00 PM"
  ];

  const guestOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      {success && (
        <div className="bg-green-900/50 border border-green-600 text-green-100 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Reservation Confirmed! 🎉</p>
          <p className="text-sm">We've sent a confirmation email to {formData.email}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-600 text-red-100 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-neutral-300 flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-amber-600" />
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="bg-neutral-800 border-neutral-700 text-white"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-neutral-300 flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-amber-600" />
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="bg-neutral-800 border-neutral-700 text-white"
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-neutral-300 flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-amber-600" />
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+880 1234-567890"
            className="bg-neutral-800 border-neutral-700 text-white"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date" className="text-neutral-300 flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-amber-600" />
              Date
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              min={today}
              value={formData.date}
              onChange={handleChange}
              className="bg-neutral-800 border-neutral-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="time" className="text-neutral-300 flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-600" />
              Time
            </Label>
            <Select
              name="time"
              value={formData.time}
              onValueChange={(value) => handleSelectChange("time", value)}
              required
            >
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Number of Guests */}
        <div>
          <Label htmlFor="guests" className="text-neutral-300 flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-amber-600" />
            Number of Guests
          </Label>
          <Select
            name="guests"
            value={formData.guests}
            onValueChange={(value) => handleSelectChange("guests", value)}
            required
          >
            <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
              <SelectValue placeholder="Select guests" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
              {guestOptions.map((num) => (
                <SelectItem key={num} value={num}>
                  {num} {num === "1" ? "Guest" : "Guests"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Special Requests */}
        <div>
          <Label htmlFor="specialRequests" className="text-neutral-300 mb-2 block">
            Special Requests (Optional)
          </Label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="Allergies, special occasions, seating preferences..."
            rows={3}
            className="w-full bg-neutral-800 border-neutral-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-red-800 hover:bg-red-700 text-white py-6 text-lg font-semibold"
        >
          {loading ? "Confirming..." : "Confirm Reservation"}
        </Button>
      </form>
    </div>
  );
}