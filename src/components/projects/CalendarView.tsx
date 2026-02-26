import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '../../types/project';
import { getStatusColor } from '../../utils/projectUtils';
import './CalendarView.css';

interface CalendarViewProps {
    projects: Project[];
    onEventClick: (project: Project) => void;
}

export function CalendarView({ projects, onEventClick }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const calendarDays = useMemo(() => {
        const days = [];
        const today = new Date();

        // Empty cells for days before the 1st
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ dayNumber: null, isToday: false, events: [] });
        }

        // Actual days
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = today.getDate() === i &&
                today.getMonth() === currentDate.getMonth() &&
                today.getFullYear() === currentDate.getFullYear();

            // Find projects that have their shoot date on this day
            const events = projects.filter(p => {
                const pDate = new Date(p.shootDate);
                return pDate.getDate() === i &&
                    pDate.getMonth() === currentDate.getMonth() &&
                    pDate.getFullYear() === currentDate.getFullYear();
            }).sort((a, b) => new Date(a.shootDate).getTime() - new Date(b.shootDate).getTime());

            days.push({ dayNumber: i, isToday, events });
        }

        // Pad end
        const totalCells = Math.ceil(days.length / 7) * 7;
        const padding = totalCells - days.length;
        for (let i = 0; i < padding; i++) {
            days.push({ dayNumber: null, isToday: false, events: [] });
        }

        return days;
    }, [currentDate, projects, daysInMonth, firstDayOfMonth]);

    return (
        <div className="calendar-container animate-fade-in">
            <div className="calendar-header">
                <button className="calendar-nav-btn" onClick={prevMonth}>
                    <ChevronLeft size={20} />
                </button>
                <div className="calendar-month-title">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>
                <button className="calendar-nav-btn" onClick={nextMonth}>
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="calendar-grid">
                {dayNames.map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                ))}

                {calendarDays.map((cell, index) => (
                    <div
                        key={index}
                        className={`calendar-day ${!cell.dayNumber ? 'empty' : ''} ${cell.isToday ? 'today' : ''}`}
                    >
                        {cell.dayNumber && <div className="day-number">{cell.dayNumber}</div>}
                        {cell.events.map(event => {
                            const timeStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(event.shootDate));
                            return (
                                <div
                                    key={event.id}
                                    className="calendar-event"
                                    style={{ borderLeftColor: getStatusColor(event.status) }}
                                    onClick={() => onEventClick(event)}
                                    title={`${timeStr} - ${event.title}\n(${event.type})`}
                                >
                                    <span className="event-time" style={{ color: getStatusColor(event.status) }}>{timeStr}</span>
                                    <span className="event-title">{event.title}</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
