import GetEventById from './GetEventById';

const GetBookingDetails = async (eventId) => {
    // This is a placeholder. In a real app, you might hit a dedicated /bookings/summary endpoint
    // We reuse GetEventById and map the fields to the DTO structure for consistency
    const event = await GetEventById(eventId); 

    if (!event) return null;

    // Map Event details to DTO structure
    return {
        EventName: event.name,
        Location: event.location,
        EventDate: event.date,
        Time: event.time,
        PricePerTicket: parseFloat(event.price),
        TotalSeats: event.seats,
        ImagePath: event.imagePath
    };
};
export default GetBookingDetails;