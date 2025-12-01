import React, { useState,useEffect } from 'react';
import { Rating } from 'react-simple-star-rating'; 
import styles from './FeedbackForm.module.css'; 
import api from '../Login/Api';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';

function SubmitFeedback({onViewPrevious}) {
    const { userId } = useAuth();
    
    const [eventId, setEventId] = useState("");
    const [allEvents, setAllEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);

    const [overallExperience, setOverallExperience] = useState(0);
    const [contentQuality, setContentQuality] = useState(0);
    const [venueFacilities, setVenueFacilities] = useState(0);
    const [eventOrganization, setEventOrganization] = useState(0);
    const [valueForMoney, setValueForMoney] = useState(0);
    const [comments, setComments] = useState("");

    useEffect(() => {
        setIsLoadingEvents(true);
        api.get(`/Feedbacks/GetBookedEventsByUserId/${userId}`) 
            .then(response => {
                setAllEvents(response.data);
            })
            .catch(err => {
                console.error("Error fetching all events:", err);
            })
            .finally(() => {
                setIsLoadingEvents(false);
            });
    }, [userId]);

    const handleRating = (rate, setter) => {
        setter(rate);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!eventId) {
            toast.error('Please select an event.');
            return;
        }
        if (overallExperience === 0) {
            toast.error('Please provide an overall experience rating.');
            return;
        }

        // ensure numeric values and a consistent payload shape (both camelCase & PascalCase)
        const eid = parseInt(eventId, 10);
        const uid = parseInt(userId, 10);
        const payload = {
            // camelCase (frontend-friendly)
            eventId: eid,
            userId: uid,
            rating: Number(overallExperience || 0),
            contentQuality: Number(contentQuality || 0),
            venueFacilities: Number(venueFacilities || 0),
            eventOrganization: Number(eventOrganization || 0),
            valueForMoney: Number(valueForMoney || 0),
            comments: comments || '',

            // PascalCase (server .NET model binding tolerance)
            EventId: eid,
            UserId: uid,
            Rating: Number(overallExperience || 0),
            ContentQuality: Number(contentQuality || 0),
            VenueFacilities: Number(venueFacilities || 0),
            EventOrganization: Number(eventOrganization || 0),
            ValueForMoney: Number(valueForMoney || 0),
            Comments: comments || ''
        };

        try {
            console.log('Submitting feedback payload:', payload);
            const response = await api.post('/Feedbacks/SubmitFeedback', payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Feedback submitted successfully:', response);
            toast.success('Thank you! Your feedback has been submitted.');
            setEventId("");
            setOverallExperience(0);
            setContentQuality(0);
            setVenueFacilities(0);
            setEventOrganization(0);
            setValueForMoney(0);
            setComments("");
        } catch (err) {
            console.error('Feedback submission error:', err);
            console.error('Error response:', err.response);

            // show best possible message from server validation
            let errorMessage = 'An error occurred.';
            if (err.response) {
                const data = err.response.data;
                // If backend returns a string
                if (typeof data === 'string') errorMessage = data;
                // If backend returns validation errors in an errors object
                else if (data && data.errors) {
                    const firstKey = Object.keys(data.errors)[0];
                    errorMessage = data.errors[firstKey][0] || JSON.stringify(data.errors);
                }
                // If backend returns a title/message
                else if (data && (data.title || data.message)) {
                    errorMessage = data.title || data.message;
                } else {
                    // fallback to stringify for debugging
                    errorMessage = JSON.stringify(data);
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast.error(`Error: ${errorMessage}`);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Event Feedback</h2>
            
            <form onSubmit={handleSubmit} className={styles.form}>
                
                <div >
                    <label className={styles.headingevent}>Event:  </label>
                    <select
                        value={eventId}
                        onChange={(e) => setEventId(e.target.value)}
                        className={styles.inputField} 
                    >   
                        {/* Default "loading" option */}
                        <option value="">
                            {isLoadingEvents ? "Loading events..." : "-- Select an event --"}
                        </option>
                        
                        {/* Map over the events from the API */}
                        {allEvents.map(event => (
                            <option key={event.eventID} value={event.eventID}>
                                {event.eventName} 
                            </option>
                        ))}
                    </select>
                </div>
                
                <label className={styles.heading}>Overall Experience</label>
                <div className={styles.starRating}>
                    <Rating
                        onClick={(rate) => handleRating(rate, setOverallExperience)}
                        initialValue={overallExperience}
                        size={40}
                    />
                </div>

                <label className={styles.heading}>Rate Specific Aspects</label>
                <div className={styles.ratingGrid}> 
                    <div className={styles.ratingGridRow}>
                        <label>Content Quality</label>
                        <Rating onClick={(rate) => handleRating(rate, setContentQuality)} initialValue={contentQuality} size={23} />
                    </div>
                    <div className={styles.ratingGridRow}>
                        <label>Venue & Facilities</label>
                        <Rating onClick={(rate) => handleRating(rate, setVenueFacilities)} initialValue={venueFacilities} size={23} />
                    </div>
                    <div className={styles.ratingGridRow}>
                        <label>Event Organization</label>
                        <Rating onClick={(rate) => handleRating(rate, setEventOrganization)} initialValue={eventOrganization} size={23} />
                    </div>
                    <div className={styles.ratingGridRow}>
                        <label>Value for Money</label>
                        <Rating onClick={(rate) => handleRating(rate, setValueForMoney)} initialValue={valueForMoney} size={23} />
                    </div>
                </div>

                <label className={styles.heading}>Additional Comments</label>
                <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className={styles.textarea}
                    placeholder="Enter Comment"
                />

                <button type="button" className={styles.secondaryButton} onClick={onViewPrevious}>
                    View Previous Feedbacks
                </button>
                
                <button type="submit" className={styles.primaryButton}>
                    Submit Feedback
                </button>
            </form>
        </div>
    );
}

export default SubmitFeedback;