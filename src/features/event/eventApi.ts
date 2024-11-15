import axios from "axios";

export const fetchTotalEvents = async (token: string | null) => {
    try {
        const response = await axios.post('/api/eventslist', {}, {
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const fetchCurrentEvent = async (token: string | null, eventuuid: string | null) => {
    try {
        const response = await axios.post('/api/display/' + eventuuid, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;

    } catch (error) {
        throw error;
    }
}

export const addEventApi = async (eventData: FormData, token: string | null) => {
    try {
        const response = await axios.post('/api/events', eventData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const allEventAttendeeApi = async (eventuuid: string | null, token: string | null) => {
    try {
        const response = await axios.post(`/api/totalattendees/${eventuuid}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        {
            throw error;
        }
    }
}

// Fetching allAgendas
export const allAgendasApi = async (id: number, token: string | null) => {
    try {
        const response = await axios.get(`/api/all-agendas/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Error Occured in allAgendaApi: ", error);
        throw error;
    }
}

//Fetching allPendingRequest
export const allPendingRequest = async (eventuuid: string | null, token: string | null, user_id: string | null | number) => {
    try {
        const response = await axios.post(`/api/pending_event_requests/${eventuuid}`, { user_id }, {
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        {
            throw error;
        }
    }
}