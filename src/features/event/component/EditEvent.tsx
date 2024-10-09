import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Country, State, City } from 'country-state-city';
import { TiArrowRight } from "react-icons/ti";
import '../component/style/addEvent.css';
import { fetchEvents } from '../eventSlice';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type formInputType = {
    title: string,
    description: string,
    event_start_date: string,
    event_end_date: string,
    start_time: string,
    start_minute_time: string,
    start_time_type: string,
    end_time: string,
    end_minute_time: string,
    end_time_type: string,
    event_venue_name: string,
    event_venue_address_1: string,
    event_venue_address_2: string,
    event_date: string,
    country: string,
    state: string,
    city: string,
    pincode: string,
    image: File | null,
    feedback: number,
    status: number,
    google_map_link: string,
    _method: string
};

type eventType = {
    title: string,
    image: string,
    description: string,
    qr_code: string,
    event_start_date: string,
    event_end_date: string,
    start_time: string,
    start_minute_time: string,
    start_time_type: string,
    end_time: string,
    end_minute_time: string,
    end_time_type: string,
    event_venue_name: string,
    event_venue_address_1: string,
    google_map_link: string,
    country: string,
    state: string,
    city: string,
    pincode: string
}



const EditEvent: React.FC = () => {
    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const { currentEvent, currentEventUUID } = useSelector((state: RootState) => ({
        currentEvent: state.events.currentEvent as eventType,
        currentEventUUID: state.events.currentEventUUID
    }));;
    const { token } = useSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<formInputType>();
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [image, setImage] = useState();
    const selectedCountryCode = watch('country');
    const dummyImage = imageBaseUrl + '/' + currentEvent.image;


    const handleImageUpload = (e: any) => {
        const file = e.target.files?.[0];
        setImage(file)
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    useEffect(() => {
        const countryList = Country.getAllCountries();
        setCountries(countryList);

        if (currentEvent) {
            const initialCountry = currentEvent.country;
            const initialState = currentEvent.state;
            const initialCity = currentEvent.city;

            setValue('country', initialCountry);
            setValue('state', initialState);
            setValue('city', initialCity);

            if (initialCountry) {
                const statesOfCountry = State.getStatesOfCountry(initialCountry);
                setStates(statesOfCountry);

                if (initialState) {
                    const citiesOfState = City.getCitiesOfState(initialCountry, initialState);
                    setCities(citiesOfState);
                }
            }
        }
    }, [currentEvent, setValue]);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCountry = e.target.value;
        setValue('country', selectedCountry);
        setStates(State.getStatesOfCountry(selectedCountry));
        setCities([]);
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedState = e.target.value;
        setValue('state', selectedState);
        setCities(City.getCitiesOfState(selectedCountryCode, selectedState));
    };



    const onSubmit: SubmitHandler<formInputType> = async (data) => {

        data.event_venue_address_2 = data.event_venue_address_1;
        data.event_date = data.event_start_date;
        data.feedback = 1;
        data.status = 1;
        data._method = 'PUT';


        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        if (image) {
            formData.set('image', image);
        }

        try {
            const response = await axios.post('/api/events/' + currentEventUUID, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response.data)

            if (response.data.status === 200) {
                await dispatch(fetchEvents(token))
                toast.success('Event updated successfully!', {
                    autoClose: 2000,
                });
            }

            navigate('/');



            // Clear the form
            reset();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Something went wrong!';
            toast.error(errorMessage);
        }
    };


    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const amPm = ['AM', 'PM'];

    return (

        <div className='p-6 pt-3'>
            <h2 className='text-black text-2xl font-semibold ps-5'>Add Details to create new event</h2>
            {/* <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-1 gap-4"> */}
            <form onSubmit={handleSubmit(onSubmit)} className="gap-4">
                <div className='flex flex-col gap-3 my-4'>
                    {/* Title */}
                    <label htmlFor="title" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Event Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="title" defaultValue={currentEvent.title} type="text" className="grow" {...register('title', { required: 'Title is required' })} />
                    </label>
                    {errors.title && <p className="text-red-600">{errors.title.message}</p>}
                </div>

                <div className='flex flex-col gap-3 my-4'>
                    {/* Description */}
                    <label htmlFor="description" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Description &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <textarea id="description" defaultValue={currentEvent.description} className="grow bg-white" {...register('description', { required: 'Description is required' })} />
                    </label>
                    {errors.description && <p className="text-red-600">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                    <div className='flex flex-col gap-3'>
                        {/* Event Start Date */}
                        <label htmlFor="event_start_date" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Event Start Date &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="event_start_date" defaultValue={currentEvent.event_start_date} type="date" className="grow bg-white" {...register('event_start_date', { required: 'Start date is required' })} />
                        </label>
                        {errors.event_start_date && <p className="text-red-600">{errors.event_start_date.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* Event End Date */}
                        <label htmlFor="event_end_date" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Event End Date &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="event_end_date" defaultValue={currentEvent.event_end_date} type="date" className="grow" {...register('event_end_date', { required: 'End date is required' })} />
                        </label>
                        {errors.event_end_date && <p className="text-red-600">{errors.event_end_date.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 my-4">
                    <div className='flex flex-col gap-3'>
                        {/* Start Time */}
                        <label className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Start Time &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <div className="flex gap-2 grow">
                                <select id="start_time" defaultValue={currentEvent.start_time} className="grow bg-white" {...register('start_time', { required: 'Start hour is required' })}>
                                    <option value="">HH</option>
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                                <select id="start_minute_time" defaultValue={currentEvent.start_minute_time} className="grow bg-white" {...register('start_minute_time', { required: 'Start minute is required' })}>
                                    <option value="">MM</option>
                                    {minutes.map((minute) => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </select>
                                <select id="start_time_type" defaultValue={currentEvent.start_time_type} className="grow bg-white" {...register('start_time_type', { required: 'AM/PM is required' })}>
                                    <option value="">AM/PM</option>
                                    {amPm.map((ampm) => (
                                        <option key={ampm} value={ampm}>{ampm}</option>
                                    ))}
                                </select>
                            </div>
                        </label>
                        {errors.start_time && <p className="text-red-600">{errors.start_time.message}</p>}
                        {errors.start_minute_time && <p className="text-red-600">{errors.start_minute_time.message}</p>}
                        {errors.start_time_type && <p className="text-red-600">{errors.start_time_type.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* End Time */}
                        <label className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">End Time &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <div className="flex gap-2 grow">
                                <select id="end_time" defaultValue={currentEvent.end_time} className="grow bg-white" {...register('end_time', { required: 'End hour is required' })}>
                                    <option value="">HH</option>
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                                <select id="end_minute_time" defaultValue={currentEvent.end_minute_time} className="grow bg-white" {...register('end_minute_time', { required: 'End minute is required' })}>
                                    <option value="">MM</option>
                                    {minutes.map((minute) => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </select>
                                <select id="end_time_type" defaultValue={currentEvent.end_time_type} className="grow bg-white" {...register('end_time_type', { required: 'AM/PM is required' })}>
                                    <option value="">AM/PM</option>
                                    {amPm.map((ampm) => (
                                        <option key={ampm} value={ampm}>{ampm}</option>
                                    ))}
                                </select>
                            </div>
                        </label>
                        {errors.end_time && <p className="text-red-600">{errors.end_time.message}</p>}
                        {errors.end_minute_time && <p className="text-red-600">{errors.end_minute_time.message}</p>}
                        {errors.end_time_type && <p className="text-red-600">{errors.end_time_type.message}</p>}
                    </div>
                </div>





                <div className='flex flex-col gap-3 my-4'>
                    {/* Venue Name */}
                    <label htmlFor="event_venue_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Venue Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="event_venue_name" defaultValue={currentEvent.event_venue_name} type="text" className="grow" {...register('event_venue_name', { required: 'Venue name is required' })} />
                    </label>
                    {errors.event_venue_name && <p className="text-red-600">{errors.event_venue_name.message}</p>}
                </div>

                <div className='flex flex-col gap-3 my-4'>
                    {/* Venue Address */}
                    <label htmlFor="event_venue_address_1" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Venue Address &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="event_venue_address_1" defaultValue={currentEvent.event_venue_address_1} type="text" className="grow" {...register('event_venue_address_1', { required: 'Address is required' })} />
                    </label>
                    {errors.event_venue_address_1 && <p className="text-red-600">{errors.event_venue_address_1.message}</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 my-4">
                    <div className='flex flex-col gap-3'>
                        {/* Country */}
                        <label htmlFor="country" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Country &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select id="country" value={watch('country')} className="grow bg-white" {...register('country', { required: 'Country is required' })} onChange={handleCountryChange}>
                                <option value="">Select Country</option>
                                {countries.map((country) => (
                                    <option key={country.isoCode} value={country.isoCode}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {errors.country && <p className="text-red-600">{errors.country.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* State */}
                        <label htmlFor="state" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">State &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select id="state" value={watch('state')} className="grow bg-white" {...register('state', { required: 'State is required' })} onChange={handleStateChange}>
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.isoCode} value={state.isoCode}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {errors.state && <p className="text-red-600">{errors.state.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* City */}
                        <label htmlFor="city" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">City &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select id="city" value={watch('city')} className="grow bg-white" {...register('city', { required: 'City is required' })}>
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {errors.city && <p className="text-red-600">{errors.city.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* Pincode */}
                        <label htmlFor="pincode" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Pincode &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="pincode" defaultValue={currentEvent.pincode} type="text" className="grow" {...register('pincode', { required: 'Pincode is required', minLength: { value: 6, message: 'Pincode must be at least 5 characters' } })} />
                        </label>
                        {errors.pincode && <p className="text-red-600">{errors.pincode.message}</p>}
                    </div>
                </div>



                <div className='flex flex-col gap-3'>
                    {/* Image Upload */}
                    <label htmlFor="image" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className="font-semibold text-green-700 flex justify-between items-center">
                            Banner Image &nbsp; <TiArrowRight className='mt-1' />
                        </span>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="grow"
                            onChange={handleImageUpload}
                        />
                    </label>
                    {errors.image && <p className="text-red-600">{errors.image.message}</p>}

                    {/* Display the uploaded image or dummy image */}
                    <div className="mt-3">
                        <img
                            src={selectedImage || dummyImage}
                            alt="Selected Banner"
                            className="w-32 h-32 object-cover"
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-3 my-4'>
                    {/* Google Map Link */}
                    <label htmlFor="google_map_link" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Google Map Link &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="google_map_link" defaultValue={currentEvent.google_map_link} type="url" className="grow" {...register('google_map_link', { required: false, pattern: { value: /^https?:\/\//, message: 'Link must start with http or https' } })} />
                    </label>
                    {errors.google_map_link && <p className="text-red-600">{errors.google_map_link.message}</p>}
                </div>

                <div className="col-span-3 flex justify-center mt-4">
                    <button type="submit" className="btn btn-primary">Update Event</button>
                </div>
            </form>
        </div>

    );
};

export default EditEvent;