"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users, ShoppingBag, RefreshCw, Bell, Package, MapPin, Phone, Mail, Clock, CheckCircle, DollarSign } from "lucide-react";

// ✅ LOGOUT FUNCTION
async function handleLogout() {
  const confirmLogout = confirm("Are you sure you want to log out?");
  if (!confirmLogout) return;

  try {
    await fetch("/api/admin-logout", { method: "POST" });
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Logout failed. Please try again.");
  }
}

// ✅ CHANGE THIS LINE: Make sure it's default export
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
  "orders" | "reservations" | "ratings"
  >("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [newOrders, setNewOrders] = useState<string[]>([]);
  const [newReservations, setNewReservations] = useState<string[]>([]);
  
  const seenOrderIds = useRef<Set<string>>(new Set());
  const seenReservationIds = useRef<Set<string>>(new Set());

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        ordersData.orders?.forEach((order: any) => {
          if (
            order.status === "pending" && 
            !seenOrderIds.current.has(order.id)
          ) {
            setNewOrders(prev => [...prev, order.id]);
            seenOrderIds.current.add(order.id);
          }
        });
        
        setOrders(ordersData.orders || []);
      }

      // Fetch reservations
      const reservationsRes = await fetch("/api/reservations");
      const reservationsData = await reservationsRes.json();
      if (reservationsData.success) {
        reservationsData.reservations?.forEach((res: any) => {
          if (
            res.status === "pending" && 
            !seenReservationIds.current.has(res.id)
          ) {
            setNewReservations(prev => [...prev, res.id]);
            seenReservationIds.current.add(res.id);
          }
        });
        
        setReservations(reservationsData.reservations || []);
      }

      // Fetch ratings
      const ratingsRes = await fetch("/api/ratings");
      const ratingsData = await ratingsRes.json();
      if (ratingsData.success) {
        setRatings(ratingsData.ratings || []);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    if (activeTab === "orders") {
      setNewOrders([]);
    } else if (activeTab === "reservations") {
      setNewReservations([]);
    }
  }, [activeTab]);

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAllData();
  };

  const updateReservationStatus = async (id: string, status: string) => {
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAllData();
  };

  const deleteOrder = async (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });
      fetchAllData();
    }
  };

  const deleteReservation = async (id: string) => {
    if (confirm("Are you sure you want to delete this reservation?")) {
      await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      });
      fetchAllData();
    }
  };

  const deleteRating = async (id: string) => {
    if (confirm("Are you sure you want to delete this rating?")) {
      await fetch(`/api/ratings/${id}`, {
        method: "DELETE",
      });
      fetchAllData();
    }
  };

  const clearCompleted = async () => {
    if (confirm("Clear all completed orders?")) {
      await fetch("/api/orders/clear-completed", {
        method: "DELETE",
      });
      fetchAllData();
    }
  };

  useEffect(() => {
    fetchAllData();
    if (autoRefresh) {
      const interval = setInterval(fetchAllData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const pendingOrders = orders.filter((o: any) => o.status === "pending");
  const preparingOrders = orders.filter((o: any) => o.status === "preparing");
  const readyOrders = orders.filter((o: any) => o.status === "ready");
  const completedOrders = orders.filter((o: any) => o.status === "completed");

  const pendingReservations = reservations.filter((r: any) => r.status === "pending");
  const confirmedReservations = reservations.filter((r: any) => r.status === "confirmed");
  const cancelledReservations = reservations.filter((r: any) => r.status === "cancelled");

  const positiveRatings = ratings.filter((r: any) => r.rating >= 4).length;
  const negativeRatings = ratings.filter((r: any) => r.rating <= 2).length;
  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : "0.0";

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-neutral-400">Manage orders, reservations, and customer reviews</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
              Logout
            </button>

            <Button
              onClick={fetchAllData}
              variant="outline"
              className="border-neutral-600 bg-white text-black hover:bg-neutral-200"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Now
            </Button>
            <div className="flex items-center gap-2 bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-600">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="autoRefresh" className="text-white text-sm cursor-pointer">
                Auto-refresh (30s)
              </label>
            </div>
            <span className="text-neutral-500 text-sm">
              Last: {formatTime(lastRefresh.toISOString())}
            </span>
            {activeTab === "orders" && (
              <Button
                variant="destructive"
                onClick={clearCompleted}
                disabled={completedOrders.length === 0}
              >
                Clear Completed ({completedOrders.length})
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-neutral-700">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-6 font-semibold transition-all flex items-center ${
              activeTab === "orders"
                ? "text-amber-500 border-b-2 border-amber-500"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="inline mr-2 h-5 w-5" />
            Orders
            {newOrders.length > 0 && (
              <Badge className="ml-2 bg-red-600 animate-pulse">
                {newOrders.length}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`pb-4 px-6 font-semibold transition-all flex items-center ${
              activeTab === "reservations"
                ? "text-amber-500 border-b-2 border-amber-500"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Users className="inline mr-2 h-5 w-5" />
            Reservations
            {newReservations.length > 0 && (
              <Badge className="ml-2 bg-red-600 animate-pulse">
                {newReservations.length}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab("ratings")}
            className={`pb-4 px-6 font-semibold transition-all flex items-center ${
              activeTab === "ratings"
                ? "text-amber-500 border-b-2 border-amber-500"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            ⭐ Ratings
          </button>
        </div>

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-yellow-950 border-2 border-yellow-600 rounded-lg p-6 text-center">
                <div className="text-5xl font-bold text-yellow-400">
                  {pendingOrders.length}
                </div>
                <div className="text-yellow-300 mt-2 font-semibold">
                  🔔 Pending
                </div>
                <div className="text-yellow-400/70 text-xs mt-1">
                  Awaiting confirmation
                </div>
              </div>

              <div className="bg-blue-950 border-2 border-blue-600 rounded-lg p-6 text-center">
                <div className="text-5xl font-bold text-blue-400">
                  {preparingOrders.length}
                </div>
                <div className="text-blue-300 mt-2 font-semibold">
                  👨‍🍳 Preparing
                </div>
                <div className="text-blue-400/70 text-xs mt-1">
                  Being prepared
                </div>
              </div>

              <div className="bg-purple-950 border-2 border-purple-600 rounded-lg p-6 text-center">
                <div className="text-5xl font-bold text-purple-400">
                  {readyOrders.length}
                </div>
                <div className="text-purple-300 mt-2 font-semibold">
                  ✅ Ready
                </div>
                <div className="text-purple-400/70 text-xs mt-1">
                  Ready for delivery
                </div>
              </div>

              <div className="bg-green-950 border-2 border-green-600 rounded-lg p-6 text-center">
                <div className="text-5xl font-bold text-green-400">
                  {completedOrders.length}
                </div>
                <div className="text-green-300 mt-2 font-semibold">
                  🎉 Completed
                </div>
                <div className="text-green-400/70 text-xs mt-1">
                  Delivered & rated
                </div>
              </div>
            </div>

            {/* All Orders */}
            {sortedOrders.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  All Orders ({orders.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {sortedOrders.map((order: any) => (
                    <div 
                      key={order.id} 
                      className={`border rounded-lg bg-neutral-950 text-white space-y-4 p-5 ${newOrders.includes(order.id) ? 'ring-2 ring-yellow-500' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold">
                            Order #{order.id.slice(-6).toUpperCase()}
                          </h2>
                          <p className="text-sm opacity-70">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              order.status === "pending"
                                ? "bg-yellow-600"
                                : order.status === "preparing"
                                ? "bg-blue-600"
                                : order.status === "ready"
                                ? "bg-purple-600"
                                : "bg-green-600"
                            }
                          >
                            {order.status.toUpperCase()}
                          </Badge>
                          {newOrders.includes(order.id) && (
                            <Badge className="bg-red-600 animate-pulse">
                              <Bell className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="text-sm space-y-2 bg-neutral-900 p-3 rounded">
                        <p className="flex items-center gap-2">
                          <span className="opacity-70">👤</span>
                          <span className="font-medium">{order.customerName}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 opacity-70" />
                          <span className="text-sm">{order.customerEmail}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 opacity-70" />
                          <span className="text-sm">{order.customerPhone}</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 opacity-70 mt-0.5" />
                          <span className="text-sm">{order.deliveryAddress}</span>
                        </p>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-amber-400 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Order Items:
                        </h3>
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm bg-neutral-900/50 p-2 rounded">
                            <span>
                              {item.name} × {item.qty}
                            </span>
                            <span className="font-medium">BDT {(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="border-t border-neutral-700 pt-3">
                        <p className="text-lg font-semibold flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-amber-400" />
                            Total:
                          </span>
                          <span className="text-amber-400">BDT {order.total.toFixed(2)}</span>
                        </p>
                      </div>

                      {/* Payment Method */}
                      <div className="bg-neutral-900 p-3 rounded">
                        <h3 className="font-bold text-orange-400 mb-1">Payment Method</h3>
                        <p className="capitalize">
                          {order.paymentMethod === "bkash" ? "bKash" : "Cash on Delivery"}
                        </p>
                      </div>

                      {/* bKash Details */}
                      {order.paymentMethod === "bkash" && (
                        <div className="p-3 border border-pink-600 rounded-lg bg-pink-950/30">
                          <h3 className="font-bold text-pink-400 mb-2">
                            📱 bKash Payment Details
                          </h3>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-semibold">Customer bKash:</span>{" "}
                              {order.bkashNumber || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold">Transaction ID:</span>{" "}
                              {order.bkashTransactionId || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold">Paid Amount:</span>{" "}
                              <span className="text-green-400 font-bold">
                                BDT {order.bkashAmount?.toFixed(2) || "N/A"}
                              </span>
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {order.notes && (
                        <div className="bg-neutral-900 p-3 rounded text-sm">
                          <span className="opacity-70">Notes:</span> {order.notes}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {order.status === "pending" && (
                          <>
                            <Button
                              onClick={() => updateOrderStatus(order.id, "preparing")}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              Start Preparing
                            </Button>
                            <Button
                              onClick={() => deleteOrder(order.id)}
                              variant="destructive"
                              size="icon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {order.status === "preparing" && (
                          <>
                            <Button
                              onClick={() => updateOrderStatus(order.id, "ready")}
                              className="flex-1 bg-purple-600 hover:bg-purple-700"
                            >
                              Mark Ready
                            </Button>
                            <Button
                              onClick={() => deleteOrder(order.id)}
                              variant="destructive"
                              size="icon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {order.status === "ready" && (
                          <>
                            <Button
                              onClick={() => updateOrderStatus(order.id, "completed")}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              Complete Order
                            </Button>
                            <Button
                              onClick={() => deleteOrder(order.id)}
                              variant="destructive"
                              size="icon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {order.status === "completed" && (
                          <Button
                            onClick={() => deleteOrder(order.id)}
                            variant="destructive"
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Order
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <ShoppingBag className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400 text-xl">No orders yet</p>
              </div>
            )}
          </>
        )}

        {/* RESERVATIONS TAB */}
        {activeTab === "reservations" && (
          <>
            {/* Status Boxes */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-yellow-950 border-2 border-yellow-600 rounded-lg p-6 text-center">
                <div className="text-5xl font-bold text-yellow-400">
                  {pendingReservations.length}
                </div>
                <div className="text-yellow-300 mt-2 font-semibold">
                  ⏳ Pending
                </div>
                <div className="text-yellow-400/70 text-xs mt-1">
                  Awaiting confirmation
                </div>
              </div>

              <div className="bg-green-950 border-2 border-green-600 rounded-lg p-6 text-center">
                <div className="text-5xl font-bold text-green-400">
                  {confirmedReservations.length}
                </div>
                <div className="text-green-300 mt-2 font-semibold">
                  ✅ Confirmed
                </div>
                <div className="text-green-400/70 text-xs mt-1">
                  Ready for guests
                </div>
              </div>

              <div className="bg-red-950 border-2 border-red-600 rounded-lg p-6 text-center">
                <div className="text-5xl font-bold text-red-400">
                  {cancelledReservations.length}
                </div>
                <div className="text-red-300 mt-2 font-semibold">
                  ❌ Cancelled
                </div>
                <div className="text-red-400/70 text-xs mt-1">
                  Not available
                </div>
              </div>
            </div>

            {/* All Reservations */}
            {reservations.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  All Reservations ({reservations.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...reservations].sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  ).map((reservation: any) => (
                    <div 
                      key={reservation.id} 
                      className={`border rounded-lg bg-neutral-950 text-white space-y-4 p-5 ${newReservations.includes(reservation.id) ? 'ring-2 ring-yellow-500' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold">
                            Reservation #{reservation.id.slice(-6).toUpperCase()}
                          </h2>
                          <p className="text-sm opacity-70">
                            {new Date(reservation.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              reservation.status === "pending"
                                ? "bg-yellow-600"
                                : reservation.status === "confirmed"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }
                          >
                            {reservation.status.toUpperCase()}
                          </Badge>
                          {newReservations.includes(reservation.id) && (
                            <Badge className="bg-red-600 animate-pulse">
                              <Bell className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="text-sm space-y-2 bg-neutral-900 p-3 rounded">
                        <p className="flex items-center gap-2">
                          <span className="opacity-70">👤</span>
                          <span className="font-medium">{reservation.name}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 opacity-70" />
                          <span className="text-sm">{reservation.email}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 opacity-70" />
                          <span className="text-sm">{reservation.phone}</span>
                        </p>
                      </div>

                      {/* Reservation Details */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-amber-400">Reservation Details:</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-neutral-900/50 p-3 rounded">
                            <div className="opacity-70 text-xs mb-1">Date</div>
                            <div className="font-medium">{formatDate(reservation.date)}</div>
                          </div>
                          <div className="bg-neutral-900/50 p-3 rounded">
                            <div className="opacity-70 text-xs mb-1">Time</div>
                            <div className="font-medium">{reservation.time}</div>
                          </div>
                        </div>
                        <div className="bg-neutral-900/50 p-3 rounded">
                          <div className="opacity-70 text-xs mb-1">Guests</div>
                          <div className="font-medium text-lg">{reservation.guests} people</div>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {reservation.message && (
                        <div className="bg-neutral-900 p-3 rounded text-sm">
                          <span className="opacity-70">Special Requests:</span> {reservation.message}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {reservation.status === "pending" && (
                          <>
                            <Button
                              onClick={() => updateReservationStatus(reservation.id, "confirmed")}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              Confirm
                            </Button>
                            <Button
                              onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                              variant="destructive"
                              className="flex-1"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {(reservation.status === "confirmed" || reservation.status === "cancelled") && (
                          <Button
                            onClick={() => deleteReservation(reservation.id)}
                            variant="destructive"
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Reservation
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <Users className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400 text-xl">No reservations yet</p>
              </div>
            )}
          </>
        )}

        {/* RATINGS TAB */}
        {activeTab === "ratings" && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-amber-950 border-2 border-amber-600 rounded-lg p-6 text-center">
                <div className="text-5xl font-bold text-amber-400">
                  {ratings.length}
                </div>
                <div className="text-amber-300 mt-2 font-semibold">
                  ⭐ Total Ratings
                </div>
                <div className="text-amber-400/70 text-xs mt-1">
                  Customer feedback
                </div>
              </div>

              <div className="bg-green-950 border-2 border-green-600 rounded-lg p-6 text-center">
                <div className="text-5xl font-bold text-green-400">
                  {positiveRatings}
                </div>
                <div className="text-green-300 mt-2 font-semibold">
                  👍 Positive (4+ stars)
                </div>
                <div className="text-green-400/70 text-xs mt-1">
                  Great experiences
                </div>
              </div>

              <div className="bg-red-950 border-2 border-red-600 rounded-lg p-6 text-center">
                <div className="text-5xl font-bold text-red-400">
                  {negativeRatings}
                </div>
                <div className="text-red-300 mt-2 font-semibold">
                  👎 Needs Improvement
                </div>
                <div className="text-red-400/70 text-xs mt-1">
                  Ratings 2 stars or less
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Average Rating</h3>
                  <p className="text-neutral-400">Based on {ratings.length} customer ratings</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-amber-400">
                    {averageRating}
                  </div>
                  <div className="flex mt-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className="text-2xl text-amber-500"
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* All Ratings */}
            {ratings.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  All Customer Ratings ({ratings.length})
                </h2>
                <div className="space-y-6">
                  {ratings.map((rating: any) => (
                    <div 
                      key={rating.id} 
                      className="border border-neutral-700 rounded-lg bg-neutral-900 text-white p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            Order #{rating.orderId?.slice(-6).toUpperCase() || 'N/A'}
                          </h3>
                          <p className="text-sm text-neutral-400 mt-1">
                            Rated on {new Date(rating.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="flex mr-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span 
                                key={star} 
                                className={`text-2xl ${star <= rating.rating ? 'text-yellow-500' : 'text-neutral-600'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-2xl font-bold text-white">
                            {rating.rating}.0
                          </span>
                        </div>
                      </div>

                      {rating.feedback && rating.feedback.trim() !== "" && (
                        <div className="mt-4 p-4 bg-neutral-800 rounded-lg">
                          <p className="text-neutral-300 italic">"{rating.feedback}"</p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-700">
                                                           
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-black hover:text-black" // ← ADD THIS
                          onClick={() => {
                            const order = orders.find((o: any) => o.id === rating.orderId);
                            if (order) {
                              const itemsList = order.items.map((item: any, i: number) => 
                                `${i+1}. ${item.name} × ${item.qty} = BDT ${(item.price * item.qty).toFixed(2)}`
                              ).join('\n');
                              
                              const alertMessage = 
                                `📋 ORDER #${order.id.slice(-6).toUpperCase()}\n` +
                                `👤 Customer: ${order.customerName}\n` +
                                `📧 Email: ${order.customerEmail}\n` +
                                `📱 Phone: ${order.customerPhone}\n` +
                                `📍 Address: ${order.deliveryAddress}\n` +
                                `📅 Date: ${new Date(order.createdAt).toLocaleString()}\n` +
                                `📦 Status: ${order.status}\n` +
                                `💳 Payment: ${order.paymentMethod}\n\n` +
                                `🍽️ ORDER ITEMS:\n${itemsList}\n\n` +
                                `💰 TOTAL: BDT ${order.total.toFixed(2)}\n`;
                              
                              alert(alertMessage);
                            } else {
                              alert("Order details not found");
                            }
                          }}
                        >
                          View Order
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-xs"
                          onClick={() => deleteRating(rating.id)}
                        >
                          Delete Rating
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">⭐</div>
                <p className="text-neutral-400 text-xl">No ratings yet</p>
                <p className="text-neutral-500 mt-2">
                  Customer ratings will appear here after they rate their orders
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}