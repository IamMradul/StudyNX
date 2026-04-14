import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Subject } from '../context/DataContext';
import './SubjectsList.css';

const CircularProgress: React.FC<{ progress: number, color: string, onClick: () => void }> = ({ progress, color, onClick }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-ring-container" onClick={onClick}>
      <svg height="50" width="50" className="progress-ring">
        <circle
          className="progress-ring-circle-bg"
          strokeWidth="4"
          fill="transparent"
          r={radius}
          cx="25"
          cy="25"
        />
        <circle
          className="progress-ring-circle"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="25"
          cy="25"
        />
      </svg>
      <div className="progress-text">{progress}%</div>
    </div>
  );
};

const SubjectsList: React.FC = () => {
  const { data } = useData();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  return (
    <>
      <div className="card subjects-container">
        <div className="card-title">SUBJECTS — CLICK RING FOR DETAILS</div>
        <div className="subjects-list">
          {data.subjects.map(subject => (
            <div key={subject.id} className="subject-item">
              <CircularProgress 
                progress={subject.progress} 
                color={subject.color} 
                onClick={() => setSelectedSubject(subject)} 
              />
              <div className="subject-info">
                <div className="subject-name">{subject.name}</div>
                <div className="subject-hours">{subject.totalHours}h studied</div>
              </div>
              <div className={`subject-status tag-${subject.status.replace(' ', '-')}`}>
                {subject.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for detailed view */}
      {selectedSubject && (
        <div className="modal-overlay" onClick={() => setSelectedSubject(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedSubject.name} - Study Details</h3>
              <button className="close-btn" onClick={() => setSelectedSubject(null)}>×</button>
            </div>
            <div className="modal-body">
              <p>Check the dates you studied {selectedSubject.name}:</p>
              <div className="checkbox-grid">
                {/* Generating some dummy dates for the detailed checkbox view */}
                {Array.from({ length: 14 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - i);
                  const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  // Randomly check some based on progress
                  const isChecked = Math.random() < (selectedSubject.progress / 100);
                  return (
                    <label key={i} className="checkbox-label">
                      <input type="checkbox" defaultChecked={isChecked} />
                      <span className="custom-checkbox" style={{ '--check-color': selectedSubject.color } as React.CSSProperties}></span>
                      {dateStr}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubjectsList;
