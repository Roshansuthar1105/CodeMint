// src/pages/ComponentsGallery/components/InteractiveForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const InteractiveForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
      <motion.h2 
        className="text-2xl font-bold text-purple-600 text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Contact Form
      </motion.h2>

      <AnimatePresence>
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-8"
          >
            <motion.div
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-2xl">✓</span>
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Success!
            </h3>
            <p className="text-gray-300">
              Your message has been sent successfully.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {['name', 'email', 'message'].map((field, index) => (
              <motion.div
                key={field}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <label className="block text-sm font-medium text-purple-600 mb-2 capitalize">
                  {field}
                </label>
                {field === 'message' ? (
                  <textarea
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-2xl text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                      errors[field] ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder={`Enter your ${field}`}
                    rows="4"
                  />
                ) : (
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-2xl text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors[field] ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder={`Enter your ${field}`}
                  />
                )}
                
                <AnimatePresence>
                  {errors[field] && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm mt-1 absolute -bottom-5 left-0"
                    >
                      {errors[field]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg transition-all ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
              }`}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <motion.div
                  className="flex items-center justify-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </motion.div>
              ) : (
                'Send Message'
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveForm;