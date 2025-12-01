import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './FeedbackAdmin.module.css';

function GetTopEvents({ topEvents }) {
    const [eventDetails, setEventDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventDetails = async () => {
            const details = await Promise.all(
                topEvents.map(async (event) => {
                    try {
                        const res = await axios.get(`https://localhost:7283/api/Events/by-name?eventName=${encodeURIComponent(event.eventName)}`);
                        return { ...res.data, averageRating: event.averageRating, feedbackCount: event.feedbackCount };
                    } catch (err) {
                        return null;
                    }
                })
            );
            setEventDetails(details.filter(e => e !== null));
        };

        if (topEvents.length > 0) {
            fetchEventDetails();
        }
    }, [topEvents]);

    return (
        <div className={styles.statsContainer}>
            <h3>Top Rated Events</h3>
            {eventDetails.length > 0 ? (
                <div className={styles.topEventsGrid}>
                    {eventDetails.map(event => (
                        <div key={event.eventID} className={styles.topEventCard} onClick={() => navigate(`/event/${event.eventID}`)}>
                            <img src={event.imagePath || '/default-event.jpg'} alt={event.eventName} className={styles.topEventImage} />
                            <h4>{event.eventName}</h4>
                            <p>Average: ⭐ {event.averageRating.toFixed(1)} ({event.feedbackCount} ratings)</p>
                            <p>{event.location}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No events have 2 or more ratings yet.</p>
            )}
        </div>
    );
}

export default GetTopEvents;