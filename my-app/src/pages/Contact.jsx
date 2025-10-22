import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function Contact(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [message,setMessage] = useState('');

  const handleSubmit = (e) =>{
    e.preventDefault();
    if(!name || !email || !message) return toast.error('Please fill all fields');
    // For now just show a toast - no backend call
    toast.success('Thanks for contacting us! We will reply soon.');
    setName(''); setEmail(''); setMessage('');
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} />
        <textarea className="w-full p-2 border rounded" placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} rows={6} />
        <div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send message</button>
        </div>
      </form>
    </div>
  )
}
