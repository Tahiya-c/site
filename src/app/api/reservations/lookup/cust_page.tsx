"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Search, Hash, Calendar, Users, Clock, CheckCircle, XCircle } from "lucide-react";

export default function CustomerLookupPage() {
  const [email, setEmail] = useState("");
  const [reservationId, setReservationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<any>(null);
  const [error, setError] = useState("");

  const handleLookup = async () => {
    setLoading(true);
    setError("");
    setReservation(null);

    const response = await fetch("/api/reservations/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email || undefined,
        reservationId: reservationId || undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    setReservation(data.reservation);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-20 px-4">
      <Card className="w-full max-w-xl bg-zinc-900 border-zinc-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-orange-500">
            Find Your Reservation
          </CardTitle>
          <p className="text-zinc-400 text-sm">
            Enter your email OR reservation ID to view your booking details.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Email */}
          <div>
            <Label className="flex items-center gap-2 text-zinc-300">
              <Mail className="h-4 w-4 text-orange-500" /> Email
            </Label>
            <Input
              placeholder="john@example.com"
              className="bg-neutral-800 border-neutral-700 text-white mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* OR Divider */}
          <div className="text-center text-zinc-400">— OR —</div>

          {/* Reservation ID */}
          <div>
            <Label className="flex items-center gap-2 text-zinc-300">
              <Hash className="h-4 w-4 text-orange-500" /> Reservation ID
            </Label>
            <Input
              placeholder="e.g. clt123abc456"
              className="bg-neutral-800 border-neutral-700 text-white mt-1"
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
            />
          </div>

          <Button
            onClick={handleLookup}
            disabled={loading}
            className="w-full bg-red-800 hover:bg-red-700 text-white py-6 text-lg font-semibold"
          >
            {loading ? "Searching..." : "Search"}
            <Search className="h-5 w-5 ml-2" />
          </Button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/40 border border-red-600 text-red-200 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Result Box */}
          {reservation && (
            <Card className="bg-neutral-900 border-neutral-700 mt-4">
              <CardHeader>
                <CardTitle className="text-xl text-green-400 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Reservation Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-zinc-300">
                <p>
                  <span className="font-semibold">Name:</span> {reservation.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {reservation.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {reservation.phone}
                </p>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span>{reservation.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>{reservation.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  <span>{reservation.guests} guests</span>
                </div>

                {reservation.specialRequests && (
                  <p>
                    <span className="font-semibold">Special Requests:</span>{" "}
                    {reservation.specialRequests}
                  </p>
                )}

                {/* Optional: Status Badge */}
                <div className="mt-3">
                  <span className="px-3 py-1 text-sm rounded-full bg-green-800 text-green-200">
                    ✓ Approved
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
