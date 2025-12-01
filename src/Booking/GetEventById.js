import axios from 'axios';

// const API_BASE_URL = 'YOUR_API_BASE_URL'; 

const GetEventById = async (id) => {
  if (!id) return null;
  const endpoint = `https://localhost:7283/api/Events/${id}`;
  
  try {
    const response = await axios.get(endpoint);
    const apiData = response.data; 
    return{
        id: apiData.eventID,
        name: apiData.eventName,
        location: apiData.location,
        description: apiData.description,
        seats: apiData.totalSeats,
        price: apiData.pricePerTicket.toFixed(2),
        date: apiData.eventDate,
        time: apiData.eventTime,
        organiser: apiData.organizer,
        imagePath: apiData.imagePath,
        images: apiData.images || []
    }
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    return null; 
  }
};
export default GetEventById;