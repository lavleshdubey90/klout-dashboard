import React from 'react';
import { RootState, useAppDispatch } from '../../../redux/store';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { login } from '../authSlice';
import signinBanner from '../../../assets/images/signinbanner.webp';
import { Navigate } from 'react-router-dom';
import typingEffect from '../../../utils/typingEffect';
import HeadingH2 from '../../../component/HeadingH2';
import { Link } from 'react-router-dom';

type LoginFormInputs = {
    email: string;
    password: string;
};

const ForgotPassword: React.FC = () => {
    const dispatch = useAppDispatch();
    const { token, loading, error } = useSelector((state: RootState) => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const textToType = "Step into the Future of Event Management with Klout Club – Your Event, Your Way!";
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    const displayedText = typingEffect(textToType, typingSpeed, deletingSpeed, pauseDuration);

    const onSubmit = async (data: LoginFormInputs) => {
        dispatch(login(data));
    };

    if (token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex h-screen">
            {/* Left side with image */}
            <div className="relative w-2/3 bg-cover flex justify-center items-center" style={{ backgroundImage: `url(${signinBanner})` }}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-50"></div> {/* Black overlay with reduced opacity */}

                {/* Text */}
                <h1 className="text-white text-5xl font-normal relative z-10 p-20">
                    {displayedText}
                </h1>
            </div>

            {/* Right side with form */}
            <div className="w-1/3 flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-4">
                    <div className='flex flex-col gap-10 mb-5 text-sm justify-center'>
                        <HeadingH2 title='Forgot Your Password ?' />
                        <p>We get it, stuff happens. Just enter your email address below and we'll send you a link to reset your password!</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Error Message */}
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-klt_primary-900 text-white py-2 rounded-md"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>

                        <hr className='!my-10 border border-zinc-200' />

                        <p>Already have an account ? <Link to={"/login"} className='text-klt_primary-900'>Login</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;