import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarClock, MapPin, SquareParking } from 'lucide-react';
import '../styles/BookingDetail.css';

const API_BASE = 'https://parkfasto-backend-2.onrender.com/api/v1';

export default function BookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/parking/bookings`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to load booking.');
        return;
      }

      const found = (data.data || []).find((b) => b._id === bookingId);
      if (!found) {
        setError('Booking not found.');
        return;
      }

      setBooking(found);
    } catch (err) {
      console.error('Failed to fetch booking detail:', err);
      setError('Failed to load booking.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const canCancel = useMemo(() => booking?.status === 'booked', [booking]);

  const handleCancelBooking = async () => {
    if (!canCancel || cancelLoading) return;

    try {
      setCancelLoading(true);
      setError('');
      setMessage('');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/parking/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to cancel booking.');
        return;
      }
      setBooking(data.data);
      setMessage('Booking canceled successfully.');
    } catch (err) {
      console.error('Cancel booking failed:', err);
      setError('Failed to cancel booking.');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return <div className="booking-detail-page">Loading booking details...</div>;
  }

  if (!booking) {
    return (
      <div className="booking-detail-page">
        <div className="booking-detail-card">
          <h2>Booking not found</h2>
          <button className="booking-detail-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-detail-page">
      <div className="booking-detail-head">
        <button className="booking-detail-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="booking-detail-card">
        <div className="booking-detail-title-row">
          <h1>{booking.parkingLot?.name || 'Parking Booking'}</h1>
          <span className={`booking-badge ${booking.status}`}>{booking.status}</span>
        </div>

        <div className="booking-detail-grid">
          <div className="booking-pill">
            <MapPin size={16} />
            {booking.parkingLot?.name || 'Parking Lot'}
          </div>
          <div className="booking-pill">
            <SquareParking size={16} />
            Slots: {booking.slots || 1}
          </div>
          <div className="booking-pill">
            <CalendarClock size={16} />
            Start: {booking.startTime ? new Date(booking.startTime).toLocaleString() : '-'}
          </div>
          <div className="booking-pill">
            <CalendarClock size={16} />
            End: {booking.endTime ? new Date(booking.endTime).toLocaleString() : '-'}
          </div>
        </div>

        {error && <p className="booking-detail-msg error">{error}</p>}
        {message && <p className="booking-detail-msg success">{message}</p>}

        <div className="booking-detail-actions">
          {booking.parkingLot?._id && (
            <button
              className="booking-detail-secondary"
              onClick={() => navigate(`/parking/lot/${booking.parkingLot._id}`, { state: { lot: booking.parkingLot } })}
            >
              View Parking Lot
            </button>
          )}
          <button
            className="booking-detail-danger"
            disabled={!canCancel || cancelLoading}
            onClick={handleCancelBooking}
          >
            {cancelLoading ? 'Canceling...' : canCancel ? 'Cancel Booking' : 'Booking cannot be canceled'}
          </button>
        </div>
      </div>
    </div>
  );
}
