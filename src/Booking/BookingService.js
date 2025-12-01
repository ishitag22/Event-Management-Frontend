import api from '../Login/Api';

const API_URL = '/Bookings';

// POST - Book tickets
export const bookTickets = (selectedSeats, userName, eventId) =>
  api.post(API_URL, null, { params: { selectedSeats, userName, eventId } });

// GET - All bookings
export const getAllBookings = () => api.get(API_URL);

// GET - Booking by ID
export const getBookingById = (id) => api.get(`${API_URL}/bookingId?id=${id}`);

// GET - Booking by username
export const getBookingByName = (name) => api.get(`${API_URL}/UserName?name=${name}`);

// GET - Seat availability
export const checkSeatAvailability = (eventId, requestedSeats) =>
  api.get(`${API_URL}/seatAvailability?eventId=${eventId}&requestedSeats=${requestedSeats}`);

// GET - Bookings by event
export const getBookingsByEvent = (eventId) =>
  api.get(`${API_URL}/eventId?eventId=${eventId}`);

// GET - Top booked events
export const getTopBookedEvents = (count) =>
  api.get(`${API_URL}/topEvents?count=${count}`);

// GET - Payment by booking ID
export const getPaymentByBooking = (bookingId) =>
  api.get(`${API_URL}/payment/${bookingId}`);

// PUT - Update booking
export const updateBooking = (id, bookingDto) =>
  api.put(`${API_URL}/bookingId?id=${id}`, bookingDto);

// PUT - Update completed bookings
export const updateCompletedBookings = () =>
  api.put(`${API_URL}/update-completed-bookings`);

// DELETE - Delete booking
export const deleteBooking = (id) =>
  api.delete(`${API_URL}/id?id=${id}`);