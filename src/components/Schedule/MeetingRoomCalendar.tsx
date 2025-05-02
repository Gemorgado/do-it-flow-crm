
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useReservations } from "@/hooks/useReservations";
import { NewReservationDialog } from "./NewReservationDialog";
import { ReservationDetailsDialog } from "./ReservationDetailsDialog";
import { Card } from "@/components/ui/card";
import { Resource } from "@/types/schedule";
import { getResourceColor } from "./util";

export function MeetingRoomCalendar() {
  const { data: reservations = [] } = useReservations();
  const [newReservationInfo, setNewReservationInfo] = useState<any | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  const selectedReservation = selectedEventId 
    ? reservations.find(r => r.id === selectedEventId) 
    : null;
  
  const handleSelectTimeSlot = (info: any) => {
    setNewReservationInfo({
      start: info.startStr,
      end: info.endStr
    });
  };

  const handleCloseNewDialog = () => {
    setNewReservationInfo(null);
  };
  
  const handleEventClick = (info: any) => {
    setSelectedEventId(info.event.id);
  };
  
  const handleCloseDetailsDialog = () => {
    setSelectedEventId(null);
  };
  
  // Create calendar events from reservations
  const calendarEvents = reservations.map(r => ({
    id: r.id,
    title: r.title,
    start: r.start,
    end: r.end,
    resourceId: r.resource,
    backgroundColor: getResourceColor(r.resource as Resource),
    borderColor: getResourceColor(r.resource as Resource),
  }));
  
  return (
    <>
      <Card className="p-4 mb-6">
        <div className="h-[700px]">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridDay,timeGridWeek'
            }}
            slotMinTime="08:00:00"
            slotMaxTime="19:00:00"
            slotDuration="00:30:00"
            events={calendarEvents}
            selectMirror
            selectable
            select={handleSelectTimeSlot}
            eventClick={handleEventClick}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            locale="pt-br"
          />
        </div>
      </Card>
      
      <NewReservationDialog 
        isOpen={!!newReservationInfo}
        onClose={handleCloseNewDialog} 
        defaultValues={newReservationInfo}
      />
      
      {selectedReservation && (
        <ReservationDetailsDialog
          isOpen={!!selectedReservation}
          onClose={handleCloseDetailsDialog}
          reservation={selectedReservation}
        />
      )}
    </>
  );
}
