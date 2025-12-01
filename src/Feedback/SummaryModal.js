import React from 'react';
import styles from './SummaryModal.module.css'; 
import BarChart from './BarChart';

function SummaryModal({ data, onClose }) {
    if (!data) return null;

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
                
                <h2>Summary for "{data.eventName}"</h2>
                
                <div className={styles.summaryItem}>
                    <strong>Total Submissions:</strong>
                    <span>{data.totalFeedback}</span>
                </div>
                
                <div className={styles.summaryItem}>
                    <strong>Average Rating:</strong>
                    <span>{data.averageRating.toFixed(2)} / 5</span>
                </div>

                <div className={styles.chartContainer}>
                    <h4>Rating Distribution</h4>
                    <BarChart chartData={data.ratingDistribution} />
                </div>
            </div>
        </div>
    );
}

export default SummaryModal;