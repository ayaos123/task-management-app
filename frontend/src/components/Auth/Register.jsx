import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    general: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    password_confirmation: false
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validation rules (unchanged)
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (value.length > 50) {
          error = 'Name must be less than 50 characters';
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = 'Email is required';
        } else if (!emailRegex.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one number';
        }
        break;
        
      case 'password_confirmation':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  // Validate all fields (unchanged)
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  };

  // Validate on field change (unchanged)
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value),
        general: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formData[name])
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = {};
    Object.keys(touched).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors).find(field => errors[field]);
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
      return;
    }

    setErrors(prev => ({ ...prev, general: '' }));
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      
      if (errorMessage.toLowerCase().includes('email already')) {
        setErrors(prev => ({
          ...prev,
          email: 'This email is already registered',
          general: 'Email already exists. Please use a different email or try logging in.'
        }));
        document.getElementById('email')?.focus();
      } else {
        setErrors(prev => ({
          ...prev,
          general: errorMessage
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator (unchanged)
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: '', color: 'gray' };
    
    let score = 0;
    if (password.length >= 6) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*])/.test(password)) score++;
    
    const strengths = [
      { text: 'Very Weak', color: 'red' },
      { text: 'Weak', color: 'orange' },
      { text: 'Fair', color: 'yellow' },
      { text: 'Good', color: 'blue' },
      { text: 'Strong', color: 'green' }
    ];
    
    return { 
      score: Math.min(score, 5), 
      text: strengths[Math.min(score - 1, 4)]?.text || '', 
      color: strengths[Math.min(score - 1, 4)]?.color || 'gray' 
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left side - Visual showcase */}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="relative">
              {/* Main visual container */}
              <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl shadow-purple-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  {/* Animated icon */}
                  <div className="relative mx-auto w-32 h-32 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>

                  {/* Feature cards */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {[
                      { icon: '🚀', title: 'Instant Access', desc: 'Start immediately' },
                      { icon: '🔒', title: 'Secure', desc: 'Bank-level security' },
                      { icon: '🌟', title: 'Premium', desc: 'Exclusive features' },
                      { icon: '🤝', title: 'Community', desc: 'Join thousands' }
                    ].map((feature, index) => (
                      <div 
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 transform hover:scale-105 transition-transform duration-300"
                      >
                        <div className="text-2xl mb-2">{feature.icon}</div>
                        <div className="font-semibold text-white">{feature.title}</div>
                        <div className="text-sm text-white/80">{feature.desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Testimonial */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        AS
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold text-white">Alex Smith</div>
                        <div className="text-sm text-white/80">Joined 3 months ago</div>
                      </div>
                    </div>
                    <p className="text-white/90 italic">
                      "The best decision I made this year! The community and features are incredible."
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg animate-bounce">
                🎉 Trusted by 50k+ users
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg animate-pulse">
                ⚡ Get started free
              </div>
            </div>
          </div>

          {/* Right side - Registration form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-lg">
              {/* Form container with glassmorphism effect */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/10 border border-white/40 overflow-hidden">
                {/* Decorative header with gradient */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-8 px-6 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full"></div>
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 border-2 border-white/30">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Join Us Today</h1>
                    <p className="text-indigo-100">Begin your journey in seconds</p>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Progress indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-600">Account Setup</span>
                      <span className="font-semibold text-indigo-600">Step 1 of 3</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: '33%' }}
                      ></div>
                    </div>
                  </div>

                  {/* General error display */}
                  {errors.general && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Registration Error</h3>
                          <p className="text-sm text-red-700 mt-1">{errors.general}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Full Name
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          className={`relative w-full px-4 py-3.5 bg-white border ${errors.name && touched.name ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={loading}
                        />
                      </div>
                      {touched.name && errors.name && (
                        <div className="flex items-center text-sm text-red-600 animate-shake">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.name}
                        </div>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className={`relative w-full px-4 py-3.5 bg-white border ${errors.email && touched.email ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={loading}
                        />
                      </div>
                      {touched.email && errors.email && (
                        <div className="flex items-center text-sm text-red-600 animate-shake">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.email}
                        </div>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-3">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          className={`relative w-full px-4 py-3.5 bg-white border ${errors.password && touched.password ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={loading}
                        />
                      </div>

                      {/* Password strength indicator */}
                      {formData.password && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-600">Strength:</span>
                            <span className={`text-xs font-bold ${
                              passwordStrength.color === 'red' ? 'text-red-600' :
                              passwordStrength.color === 'orange' ? 'text-orange-600' :
                              passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                              passwordStrength.color === 'blue' ? 'text-blue-600' :
                              'text-green-600'
                            }`}>
                              {passwordStrength.text}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((index) => (
                              <div
                                key={index}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                  index <= passwordStrength.score
                                    ? passwordStrength.color === 'red' ? 'bg-red-500' :
                                      passwordStrength.color === 'orange' ? 'bg-orange-500' :
                                      passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                                      passwordStrength.color === 'blue' ? 'bg-blue-500' :
                                      'bg-green-500'
                                    : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          
                          {/* Password requirements */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className={`flex items-center p-2 rounded ${formData.password.length >= 6 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                              <svg className={`w-3 h-3 mr-2 ${formData.password.length >= 6 ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                {formData.password.length >= 6 ? (
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                ) : (
                                  <circle cx="10" cy="10" r="1.5" />
                                )}
                              </svg>
                              6+ characters
                            </div>
                            <div className={`flex items-center p-2 rounded ${/(?=.*[a-z])/.test(formData.password) ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                              <svg className={`w-3 h-3 mr-2 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                {/(?=.*[a-z])/.test(formData.password) ? (
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                ) : (
                                  <circle cx="10" cy="10" r="1.5" />
                                )}
                              </svg>
                              Lowercase
                            </div>
                            <div className={`flex items-center p-2 rounded ${/(?=.*[A-Z])/.test(formData.password) ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                              <svg className={`w-3 h-3 mr-2 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                {/(?=.*[A-Z])/.test(formData.password) ? (
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                ) : (
                                  <circle cx="10" cy="10" r="1.5" />
                                )}
                              </svg>
                              Uppercase
                            </div>
                            <div className={`flex items-center p-2 rounded ${/(?=.*\d)/.test(formData.password) ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                              <svg className={`w-3 h-3 mr-2 ${/(?=.*\d)/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                {/(?=.*\d)/.test(formData.password) ? (
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                ) : (
                                  <circle cx="10" cy="10" r="1.5" />
                                )}
                              </svg>
                              Number
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <input
                          id="password_confirmation"
                          name="password_confirmation"
                          type="password"
                          autoComplete="new-password"
                          required
                          className={`relative w-full px-4 py-3.5 bg-white border ${errors.password_confirmation && touched.password_confirmation ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                          placeholder="Confirm your password"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={loading}
                        />
                      </div>
                      {touched.password_confirmation && errors.password_confirmation ? (
                        <div className="flex items-center text-sm text-red-600 animate-shake">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.password_confirmation}
                        </div>
                      ) : formData.password_confirmation && formData.password === formData.password_confirmation && (
                        <div className="flex items-center text-sm text-green-600 animate-fadeIn">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Passwords match perfectly!
                        </div>
                      )}
                    </div>

                    {/* Terms checkbox */}
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          required
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </div>
                      <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      <div className="relative flex items-center justify-center">
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Creating Your Account...
                          </>
                        ) : (
                          <>
                            <span className="mr-2">✨</span>
                            Create Your Account
                            <span className="ml-2">→</span>
                          </>
                        )}
                      </div>
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                   
                  </div>

                  {/* Social login buttons */}


                  {/* Login link */}
                  <div className="text-center pt-4">
                    <p className="text-gray-600">
                      Already have an account?{' '}
                      <Link 
                        to="/login" 
                        className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations to global CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Register;