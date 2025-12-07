"use client";

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Users, ShoppingBag, MapPin, Phone, Mail, Package, DollarSign, Trash2, RefreshCw, Star, MessageSquare } from 'lucide-react';

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message?: string | null;
  status: string;
  createdAt: string;
}

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  notes?: string | null;
  status: string;
  createdAt: string;
}

interface Rating {
  id: string;
  orderId: string;
  rating: number;
  feedback: string | null;
  createdAt: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'reservations' | 'orders' | 'ratings'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
      setLastRefresh(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resRes = await fetch('/api/reservations');
      const resData = await resRes.json();
      setReservations(resData.reservations || []);

      const ordRes = await fetch('/api/orders');
      const ordData = await ordRes.json();
      setOrders(ordData.orders || []);

      try {
        const ratRes = await fetch('/api/ratings');
        if (ratRes.ok) {
          const ratData = await ratRes.json();
          setRatings(ratData.ratings || []);
        } else {
          console.warn('Ratings API returned error:', ratRes.status);
          setRatings([]);
        }
      } catch (ratError) {
        console.warn('Could not fetch ratings:', ratError);
        setRatings([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const updateReservationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Remove this order from the panel? (It will still be saved in the database)')) return;
    
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const clearCompletedOrders = async () => {
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');
    
    if (completedOrders.length === 0) {
      alert('No completed or cancelled orders to clear!');
      return;
    }

    if (!confirm(`Clear ${completedOrders.length} completed/cancelled orders from the panel?`)) return;

    try {
      await fetch('/api/orders/clear-completed', {
        method: 'DELETE',
      });
      fetchData();
    } catch (error) {
      console.error('Error clearing orders:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': case 'completed': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'rejected': case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'preparing': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'ready': return 'bg-purple-500/20 text-purple-400 border-purple-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

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

  const sortedOrders = [...orders].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const sortedRatings = [...ratings].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const resCounts = {
    pending: reservations.filter(r => r.status === 'pending').length,
    approved: reservations.filter(r => r.status === 'approved').length,
    rejected: reservations.filter(r => r.status === 'rejected').length,
  };

  const orderCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  const ratingStats = {
    total: ratings.length,
    average: ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : '0.0',
    fiveStar: ratings.filter(r => r.rating === 5).length,
    fourStar: ratings.filter(r => r.rating === 4).length,
    threeStar: ratings.filter(r => r.rating === 3).length,
    twoStar: ratings.filter(r => r.rating === 2).length,
    oneStar: ratings.filter(r => r.rating === 1).length,
  };

  if (loading && orders.length === 0 && reservations.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
              🔥 Club Grille Admin Panel
            </h1>
            <p className="text-neutral-400">Manage reservations, orders, and customer feedback</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchData()}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg flex items-center gap-2 border border-neutral-600"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Now
            </button>
            <div className="flex items-center gap-2 bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-600">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="autoRefresh" className="text-white text-sm cursor-pointer">
                Auto-refresh (10s)
              </label>
            </div>
            <span className="text-neutral-500 text-sm">
              Last: {formatTime(lastRefresh.toISOString())}
            </span>
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-neutral-700">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-4 px-6 font-semibold transition-all ${
              activeTab === 'reservations'
                ? 'text-amber-500 border-b-2 border-amber-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="inline mr-2 h-5 w-5" />
            Reservations
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-6 font-semibold transition-all ${
              activeTab === 'orders'
                ? 'text-amber-500 border-b-2 border-amber-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="inline mr-2 h-5 w-5" />
            Orders
            {orderCounts.pending > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                {orderCounts.pending}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`pb-4 px-6 font-semibold transition-all ${
              activeTab === 'ratings'
                ? 'text-amber-500 border-b-2 border-amber-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Star className="inline mr-2 h-5 w-5" />
            Ratings & Feedback
          </button>
        </div>

        {activeTab === 'reservations' && (
          <>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-yellow-400">{resCounts.pending}</p>
                  </div>
                  <Clock className="h-12 w-12 text-yellow-500" />
                </div>
              </div>
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Approved</p>
                    <p className="text-3xl font-bold text-green-400">{resCounts.approved}</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Rejected</p>
                    <p className="text-3xl font-bold text-red-400">{resCounts.rejected}</p>
                  </div>
                  <XCircle className="h-12 w-12 text-red-500" />
                </div>
              </div>
            </div>

            <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-900 border-b border-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-neutral-400 font-semibold">CUSTOMER</th>
                    <th className="px-6 py-4 text-left text-neutral-400 font-semibold">CONTACT</th>
                    <th className="px-6 py-4 text-left text-neutral-400 font-semibold">DATE & TIME</th>
                    <th className="px-6 py-4 text-left text-neutral-400 font-semibold">GUESTS</th>
                    <th className="px-6 py-4 text-left text-neutral-400 font-semibold">STATUS</th>
                    <th className="px-6 py-4 text-left text-neutral-400 font-semibold">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((res) => (
                    <tr key={res.id} className="border-b border-neutral-700 hover:bg-neutral-750">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
                            {res.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{res.name}</p>
                            <p className="text-neutral-400 text-sm">{formatDate(res.createdAt)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-neutral-300 text-sm flex items-center gap-2">
                          <Mail className="h-4 w-4" /> {res.email}
                        </p>
                        <p className="text-neutral-400 text-sm flex items-center gap-2">
                          <Phone className="h-4 w-4" /> {res.phone}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{formatDate(res.date)}</p>
                        <p className="text-neutral-400 text-sm">{res.time}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{res.guests} guests</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(res.status)}`}>
                          {res.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {res.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateReservationStatus(res.id, 'approved')}
                              className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateReservationStatus(res.id, 'rejected')}
                              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {res.status !== 'pending' && (
                          <span className="text-neutral-500 text-sm">✓ Email sent</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="grid grid-cols-4 gap-6 flex-1">
                <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-400 text-sm">Pending</p>
                      <p className="text-3xl font-bold text-yellow-400">{orderCounts.pending}</p>
                    </div>
                    <Clock className="h-12 w-12 text-yellow-500" />
                  </div>
                </div>
                <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-400 text-sm">Preparing</p>
                      <p className="text-3xl font-bold text-blue-400">{orderCounts.preparing}</p>
                    </div>
                    <Package className="h-12 w-12 text-blue-500" />
                  </div>
                </div>
                <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-400 text-sm">Ready</p>
                      <p className="text-3xl font-bold text-purple-400">{orderCounts.ready}</p>
                    </div>
                    <CheckCircle className="h-12 w-12 text-purple-500" />
                  </div>
                </div>
                <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-400 text-sm">Completed</p>
                      <p className="text-3xl font-bold text-green-400">{orderCounts.completed}</p>
                    </div>
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                </div>
              </div>
              
              <button
                onClick={clearCompletedOrders}
                className="ml-6 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center gap-2 whitespace-nowrap"
              >
                <Trash2 className="h-4 w-4" />
                Clear Completed
              </button>
            </div>

            <div className="space-y-4">
              {sortedOrders.map((order, index) => (
                <div key={order.id} className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-lg">
                        #{index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{order.customerName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                            {order.status?.toUpperCase() || 'PENDING'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-2 text-neutral-300">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span>{formatTime(order.createdAt)} • {formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-300">
                            <Phone className="h-4 w-4 text-amber-500" />
                            <span>{order.customerPhone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-300">
                            <Mail className="h-4 w-4 text-amber-500" />
                            <span>{order.customerEmail}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-neutral-300 mb-4">
                          <MapPin className="h-4 w-4 text-amber-500 mt-1" />
                          <span className="text-sm">{order.deliveryAddress}</span>
                        </div>

                        <div className="bg-neutral-900 rounded-lg p-4 mb-4">
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Package className="h-4 w-4 text-amber-500" />
                            Order Items:
                          </h4>
                          <div className="space-y-2">
                            {order.items?.map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-sm">
                                <span className="text-neutral-300">
                                  {item.name} <span className="text-neutral-500">× {item.qty}</span>
                                </span>
                                <span className="text-white font-medium">BDT {item.price}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-neutral-700 mt-3 pt-3 flex justify-between items-center">
                            <span className="text-white font-bold flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-amber-500" />
                              Total:
                            </span>
                            <span className="text-amber-400 font-bold text-lg">BDT {order.total}</span>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="bg-amber-900/20 border border-amber-700/50 rounded p-3 text-sm text-amber-200">
                            <strong>Note:</strong> {order.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-medium"
                        >
                          Complete Order
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-medium"
                        >
                          Cancel
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded font-medium flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {sortedOrders.length === 0 && (
                <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-12 text-center">
                  <ShoppingBag className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-400 text-lg">No orders yet</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'ratings' && (
          <>
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Total Ratings</p>
                    <p className="text-3xl font-bold text-white">{ratingStats.total}</p>
                  </div>
                  <Star className="h-12 w-12 text-amber-500" />
                </div>
              </div>
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Average Rating</p>
                    <p className="text-3xl font-bold text-amber-400">{ratingStats.average} ⭐</p>
                  </div>
                  <MessageSquare className="h-12 w-12 text-amber-500" />
                </div>
              </div>
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <div>
                  <p className="text-neutral-400 text-sm mb-2">Rating Distribution</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-300">5⭐</span>
                      <div className="flex-1 bg-neutral-900 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${ratingStats.total > 0 ? (ratingStats.fiveStar / ratingStats.total) * 100 : 0}%`}}></div>
                      </div>
                      <span className="text-neutral-400">{ratingStats.fiveStar}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-300">4⭐</span>
                      <div className="flex-1 bg-neutral-900 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: `${ratingStats.total > 0 ? (ratingStats.fourStar / ratingStats.total) * 100 : 0}%`}}></div>
                      </div>
                      <span className="text-neutral-400">{ratingStats.fourStar}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-300">3⭐</span>
                      <div className="flex-1 bg-neutral-900 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${ratingStats.total > 0 ? (ratingStats.threeStar / ratingStats.total) * 100 : 0}%`}}></div>
                      </div>
                      <span className="text-neutral-400">{ratingStats.threeStar}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">With Feedback</p>
                    <p className="text-3xl font-bold text-purple-400">
                      {ratings.filter(r => r.feedback).length}
                    </p>
                  </div>
                  <MessageSquare className="h-12 w-12 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {sortedRatings.map((rating) => (
                <div key={rating.id} className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {rating.rating}⭐
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= rating.rating
                                  ? 'fill-amber-500 text-amber-500'
                                  : 'text-neutral-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-neutral-500 text-sm">
                          {formatDate(rating.createdAt)} • {formatTime(rating.createdAt)}
                        </span>
                      </div>

                      {rating.feedback ? (
                        <div className="bg-neutral-900 rounded-lg p-4 mt-3">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-neutral-300 text-sm leading-relaxed">{rating.feedback}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-neutral-500 text-sm italic">No written feedback provided</p>
                      )}

                      <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                        <Package className="h-4 w-4" />
                        <span>Order ID: {rating.orderId.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {sortedRatings.length === 0 && (
                <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-12 text-center">
                  <Star className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-400 text-lg">No ratings yet</p>
                  <p className="text-neutral-500 text-sm mt-2">
                    Customer ratings will appear here after they complete orders
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}