import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authSendOtp, authVerifyOtp } from '../api/api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

export default function OTPLogin() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('email'); // 'email' or 'verify'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.warn('Please enter your email');
    setLoading(true);
    try {
      const res = await authSendOtp({ email });
      toast.success(res.message || 'OTP sent to email');
      setStage('verify');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    if (!otp || !email) return toast.warn('Email and OTP required');
    setLoading(true);
    try {
      const res = await authVerifyOtp({ email, otp });
      // res should be user object with token
      login(res);
      toast.success('Logged in via OTP');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {stage === 'email' ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <h2 className="text-2xl font-semibold">Login with Email OTP</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <h2 className="text-2xl font-semibold">Enter OTP</h2>
          <p className="text-sm text-gray-600">We sent a 6-digit code to <strong>{email}</strong></p>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} className="w-full p-2 border rounded" required />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">{loading ? 'Verifying...' : 'Verify OTP'}</button>
            <button type="button" onClick={() => setStage('email')} className="px-4 py-2 border rounded">Change Email</button>
          </div>
        </form>
      )}
    </div>
  );
}
