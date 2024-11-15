import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventUUID } from '../features/event/eventSlice';
import { useDispatch } from 'react-redux';
import { heading } from '../features/heading/headingSlice';
import axios from 'axios';
import Swal from 'sweetalert2';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

interface EventRowProps {
    title?: string,
    image?: string,
    event_start_date?: string,
    uuid: string,
    event_venue_name?: string,
    total_checkedin?: number,
    total_attendee?: number,
    total_checkedin_speaker?: number,
    total_checkedin_sponsor?: number,
    total_pending_delegate?: number,
    start_time?: string,
    start_minute_time?: string,
    start_time_type?: string,
    id?: number
}

const EventRow: React.FC<EventRowProps> = (props) => {

    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const { token } = useSelector((state: RootState) => (state.auth));

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const generatePDF = (uuid: string) => {
        // setLoading(true)
        axios.get(`/api/generatePDF/${uuid}`)
            .then(res => {
                if (res.data.status === 200) {
                    //   setLoading(false)
                    const url = imageBaseUrl + res.data.data.pdf_path;
                    window.open(url, '_blank');

                }

            })
    }

    const handleDelete = async (id: number) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showDenyButton: true,
            text: "You won't be able to revert this!",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                // Delete the event from the server
                await axios.delete(`/api/events/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // Show success message
                Swal.fire({
                    title: "Deleted!",
                    text: "Your event has been deleted.",
                    icon: "success",
                });

            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "There was an error deleting the event.",
                    icon: "error",
                });
            }
        }
        // https://api.klout.club/api/events/144
    }

    return (
        <div className='p-5 border-b flex items-center justify-between gap-5 rounded-lg'>

            {/* Displaying Image */}
            <img src={props.image} alt={props.title} className='max-w-60 2xl:max-w-96 w-full h-40 2xl:h-60 object-cover object-center rounded-lg' />

            {/* Title */}
            <h3 className='text-lg font-semibold max-w-[236px] 2xl:max-w-fit'>{props.title}</h3>

            {/* Date, Time and Venue */}
            <div className='flex flex-col gap-2 text-sm 2xl:text-base'>
                <div>
                    <span className="font-semibold text-black">Date</span> - {props.event_start_date}
                </div>
                <div>
                    <span className="font-semibold text-black">Time</span> - {props.start_time + ':' + props.start_minute_time + ' ' + props.start_time_type}
                </div>
                <div>
                    <span className="font-semibold text-black">Venue</span> - {props.event_venue_name}
                </div>
            </div>

            {/* Event Joiners Info */}
            <div className='h-full flex flex-col gap-y-2 min-w-48 text-sm 2xl:text-base'>
                <div className='flex items-center gap-2 font-semibold'>Total Registrations: <p className='font-medium'>{props.total_attendee}</p></div>
                <div className='flex items-center gap-2 font-semibold'>Total Attendees: <p className='font-medium'>{props.total_checkedin}</p></div>
                <div className='flex items-center gap-2 font-semibold'>Checked In Speakers: <p className='font-medium'>{props.total_checkedin_speaker}</p></div>
                <div className='flex items-center gap-2 font-semibold'>Checked In Sponsors: <p className='font-medium'>{props.total_checkedin_sponsor}</p></div>
                <div className='flex items-center gap-2 font-semibold'>Pending Delegates: <p className='font-medium'>{props.total_pending_delegate}</p></div>
            </div>

            {/* Links */}
            <div className='min-w-[110px]'>

                <Link to='/events/view-event/' className="text-pink-500 hover:underline px-3 py-1 inline-block mb-1 rounded-md text-xs font-semibold" onClick={() => {
                    dispatch(eventUUID(props.uuid)); dispatch(heading('View Event')); setTimeout(() => {
                    }, 500);
                }}>View Event</Link> <br />
                <button className="text-sky-500 hover:underline px-3 py-1 inline-block mb-1 rounded-md text-xs font-semibold" onClick={() => {
                    dispatch(eventUUID(props.uuid)); dispatch(heading('Edit Event')); setTimeout(() => {
                        navigate('/events/edit-event')
                    }, 500);
                }} >Edit Event</button> <br />
                <Link to='/events/all-attendee' className="text-blue-500 hover:underline px-3 py-1 rounded-md text-xs font-semibold inline-block mb-1" onClick={() => {
                    dispatch(eventUUID(props.uuid)); dispatch(heading('All Attendee')); setTimeout(() => {
                    }, 500);
                }}>All Attendees</Link> <br />
                {/* <button className="text-green-500 hover:underline px-3 py-1 rounded-md text-xs font-semibold inline-block mb-1">View Sponsors</button> <br /> */}
                <Link to={"/events/view-agendas"} className="text-yellow-500 hover:underline px-3 py-1 rounded-md text-xs font-semibold inline-block mb-1" onClick={() => {
                    dispatch(heading('View Agendas')); setTimeout(() => {
                    }, 500); dispatch(eventUUID(props.uuid));
                }} >View Agendas</Link> <br />

                <button className="text-purple-500 hover:underline px-3 py-1 rounded-md text-xs font-semibold inline-block mb-1"
                    onClick={() => generatePDF(props.uuid)}>Generate PDF</button> <br />
                <button className="text-red-500 hover:underline px-3 py-1 rounded-md text-xs font-semibold inline-block mb-1"
                    onClick={() => {
                        if (props.id !== undefined) {
                            handleDelete(props.id);
                        }
                    }}
                >Delete Event</button>
            </div>
        </div >
    )
}

export default EventRow;