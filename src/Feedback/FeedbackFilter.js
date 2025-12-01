import React from 'react';
import styles from './FeedbackAdmin.module.css';

// Receive all values and functions as props
function FeedbackFilter({ 
    filterEventName, setFilterEventName,
    filterMinRating, setFilterMinRating,
    filterSearch, setFilterSearch,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    onFilterSubmit, onClearFilters 
}) {

    // tells the parent to filter
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        onFilterSubmit();
    };

    // tells the parent to clear
    const handleClear = (e) => {
        if (e) e.preventDefault();
        onClearFilters();
    };

    return (
        
            <form onSubmit={handleSubmit} className={styles.filterForm}>
                <input
                    type="text"
                    placeholder="Event Name"
                    value={filterEventName} // Use value from props
                    onChange={e => setFilterEventName(e.target.value)} // Call setter from props
                />
                <input
                    type="number"
                    placeholder="Min Rating (1-5)"
                    value={filterMinRating} 
                    onChange={e => setFilterMinRating(e.target.value)} 
                    min="1"
                    max="5"
                />
                <input
                    type="text"
                    placeholder="Search in comments..."
                    value={filterSearch} 
                    onChange={e => setFilterSearch(e.target.value)} 
                />

                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="SubmittedAt">Sort by Date</option>
                    <option value="Rating">Sort by Rating</option>
                    <option value="FeedbackId">Sort by FeedbackID</option>
                </select>

                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                    <option value="descending">Descending</option>
                    <option value="ascending">Ascending</option>
                </select>

                <button type="submit">Filter</button>
                <button type="button" onClick={handleClear}>Clear</button>
            </form>
        
    );
}

export default FeedbackFilter;