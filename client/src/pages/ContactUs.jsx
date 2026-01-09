import React, { useState } from 'react';
import GuestNavbar from '../components/GuestNavbar';
import GuestFooter from '../components/GuestFooter';
import { Mail, MapPin, Phone, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import api from '../utils/api';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await api.post('/inquiries', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact error:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <GuestNavbar />
      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-700 dark:text-primary-400 mb-8 text-center">Contact Us</h1>
        <p className="text-slate-600 dark:text-slate-300 text-center max-w-2xl mx-auto mb-16 text-lg">
          We are here to assist you with any inquiries or requests. Reach out to our dedicated concierge team.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-white">Get in Touch</h3>
            <div className="space-y-6">
               <div className="flex items-start gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                 <MapPin className="text-primary-600 dark:text-primary-400 shrink-0" size={24} />
                 <div>
                   <h5 className="font-bold text-slate-800 dark:text-white mb-1">Visit Us</h5>
                   <p className="text-slate-600 dark:text-slate-300">123 Luxury Ave, Paradise City, PC 12345</p>
                 </div>
               </div>
               <div className="flex items-start gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                 <Mail className="text-primary-600 dark:text-primary-400 shrink-0" size={24} />
                 <div>
                   <h5 className="font-bold text-slate-800 dark:text-white mb-1">Email Us</h5>
                   <p className="text-slate-600 dark:text-slate-300">contact@luxurystay.com</p>
                   <p className="text-slate-600 dark:text-slate-300">reservations@luxurystay.com</p>
                 </div>
               </div>
               <div className="flex items-start gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                 <Phone className="text-primary-600 dark:text-primary-400 shrink-0" size={24} />
                 <div>
                   <h5 className="font-bold text-slate-800 dark:text-white mb-1">Call Us</h5>
                   <p className="text-slate-600 dark:text-slate-300">+1 (555) 123-4567</p>
                   <p className="text-slate-600 dark:text-slate-300">+1 (555) 987-6543</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl">
            <h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-white mb-6">Send a Message</h3>
            
            {status === 'success' ? (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-6 rounded-xl flex flex-col items-center text-center animate-fade-in">
                    <CheckCircle size={48} className="mb-4 text-green-600 dark:text-green-400" />
                    <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                    <p>Thank you for reaching out. Our team will get back to you shortly.</p>
                    <button onClick={() => setStatus('idle')} className="mt-6 text-primary-600 hover:text-primary-700 font-bold underline">Send another message</button>
                </div>
            ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                        <input 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                            placeholder="John" 
                            required 
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                        <input 
                            type="text" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                            placeholder="Doe" 
                            required 
                        />
                     </div>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                        placeholder="john@example.com" 
                        required 
                    />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                      <input 
                        type="text" 
                        name="subject" 
                        value={formData.subject} 
                        onChange={handleChange} 
                        className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                        placeholder="Inquiry about..." 
                        required 
                    />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                      <textarea 
                        name="message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        rows={4} 
                        className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                        placeholder="How can we help you?" 
                        required
                    ></textarea>
                   </div>
                   
                   {status === 'error' && (
                       <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                           <AlertCircle size={16} /> {errorMessage}
                       </div>
                   )}

                   <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                   >
                       {status === 'loading' ? <><Loader className="animate-spin" size={20} /> Sending...</> : 'Send Message'}
                   </button>
                </form>
            )}
          </div>
        </div>
      </div>
      <GuestFooter />
    </div>
  );
};

export default ContactUs;
