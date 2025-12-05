"use client";

import ReservationForm from "./ReservationForm";

export default function ReservationPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-16 px-4">
      <div className="max-w-xl w-full bg-zinc-900 p-8 rounded-xl shadow-xl border border-zinc-800">
        <h1 className="text-3xl font-bold mb-2 text-orange-500">
          Make a Reservation
        </h1>
        <p className="text-zinc-400 mb-6">
          Book your table at Club Grille for an unforgettable dining experience.
        </p>

        <ReservationForm />
      </div>
    </main>
  );
}
