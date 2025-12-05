"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ReservationForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert("Reservation submitted!");
    } else {
      alert("Failed: " + data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        placeholder="Your Name"
        value={form.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <Input
        placeholder="Email"
        value={form.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <Input
        placeholder="Phone"
        value={form.phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      <Input
        type="date"
        value={form.date}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, date: e.target.value })
        }
      />

      <Input
        type="time"
        value={form.time}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, time: e.target.value })
        }
      />

      <Input
        type="number"
        min="1"
        placeholder="Guests"
        value={form.guests}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, guests: Number(e.target.value) })
        }
      />

      <Textarea
        placeholder="Message (optional)"
        value={form.message}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setForm({ ...form, message: e.target.value })
        }
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Reservation"}
      </Button>
    </form>
  );
}
