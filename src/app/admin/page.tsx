"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, Mail, Phone, Calendar, Users } from "lucide-react";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message: string | null;
  status: string;
  createdAt: string;
}

export default function AdminPanel() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch reservations
  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/reservations");
      const data = await res.json();
      if (data.success) {
        setReservations(data.reservations);
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Update reservation status
  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (data.success) {
        // Update local state
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
        alert(`Reservation ${status}! Email sent to customer.`);
      } else {
        alert("Failed to update reservation: " + data.error);
      }
    } catch (error) {
      alert("Error updating reservation");
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading reservations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🔥 Club Grille Admin Panel
          </h1>
          <p className="text-neutral-400">Manage reservations and send automated emails</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {reservations.filter((r) => r.status === "pending").length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-yellow-400 opacity-50" />
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Approved</p>
                <p className="text-3xl font-bold text-green-400">
                  {reservations.filter((r) => r.status === "approved").length}
                </p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Rejected</p>
                <p className="text-3xl font-bold text-red-400">
                  {reservations.filter((r) => r.status === "rejected").length}
                </p>
              </div>
              <XCircle className="w-12 h-12 text-red-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                      No reservations yet
                    </td>
                  </tr>
                ) : (
                  reservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="hover:bg-neutral-800/30 transition-colors"
                    >
                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {reservation.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{reservation.name}</p>
                            <p className="text-neutral-400 text-sm">
                              {new Date(reservation.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-neutral-300 text-sm">
                            <Mail className="w-4 h-4 text-neutral-500" />
                            {reservation.email}
                          </div>
                          <div className="flex items-center gap-2 text-neutral-300 text-sm">
                            <Phone className="w-4 h-4 text-neutral-500" />
                            {reservation.phone}
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-neutral-300 text-sm">
                            <Calendar className="w-4 h-4 text-neutral-500" />
                            {new Date(reservation.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-neutral-300 text-sm">
                            <Clock className="w-4 h-4 text-neutral-500" />
                            {reservation.time}
                          </div>
                        </div>
                      </td>

                      {/* Guests */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-neutral-300">
                          <Users className="w-4 h-4 text-neutral-500" />
                          <span className="font-medium">{reservation.guests}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          {getStatusIcon(reservation.status)}
                          {reservation.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        {reservation.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(reservation.id, "approved")}
                              disabled={updating === reservation.id}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(reservation.id, "rejected")}
                              disabled={updating === reservation.id}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-neutral-500 text-sm">
                            {reservation.status === "approved" ? "✓ Email sent" : "✗ Email sent"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Message Details Section */}
        {reservations.some((r) => r.message) && (
          <div className="mt-8 bg-neutral-800/50 border border-neutral-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Special Requests</h3>
            <div className="space-y-4">
              {reservations
                .filter((r) => r.message)
                .map((r) => (
                  <div
                    key={r.id}
                    className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-white font-medium">{r.name}</p>
                      <span className="text-neutral-400 text-sm">
                        {new Date(r.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-sm">{r.message}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}