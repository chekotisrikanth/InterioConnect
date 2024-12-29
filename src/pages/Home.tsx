import React from 'react';
import { Link } from 'react-router-dom';
import { ImageCarousel } from '../components/ImageCarousel';
import { designers } from '../data/designers';
import { MessageSquare, FileText, Video, ArrowRight } from 'lucide-react';

const Home = () => {
  // Prepare carousel data from designers
  const carouselImages = designers.flatMap(designer => designer.images);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Transform Your Space with Expert Interior Designers
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect with top interior designers, get personalized quotes, and bring your dream space to life through seamless virtual collaboration.
        </p>
      </div>

      {/* Featured Designs Carousel */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Designs</h2>
        <div className="relative">
          <ImageCarousel images={carouselImages} alt="Featured interior designs" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex justify-between items-center text-white">
              <div>
                {designers.map((designer) => (
                  <span key={designer.id} className="mr-4">
                    {designer.name} • {designer.styles.join(', ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {/* Submit Requirements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Submit Requirements</h3>
          <p className="text-gray-600 mb-4">
            Share your vision and requirements to receive personalized quotes from multiple designers. Compare portfolios and choose the perfect match for your project.
          </p>
          <Link to="/client/requirements/new" className="text-blue-600 hover:text-blue-700 inline-flex items-center">
            Get Started <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Chat with Designers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Real-time Chat</h3>
          <p className="text-gray-600 mb-4">
            Communicate directly with designers through our built-in chat system. Discuss ideas, share inspiration, and get instant feedback on your project.
          </p>
          <Link to="/client/chats" className="text-green-600 hover:text-green-700 inline-flex items-center">
            Start Chatting <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Virtual Consultation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Video className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Virtual Consultation</h3>
          <p className="text-gray-600 mb-4">
            Schedule virtual consultations with designers to discuss your project in detail. Get expert advice and visualize your space through online collaboration.
          </p>
          <Link to="/browse-designers" className="text-purple-600 hover:text-purple-700 inline-flex items-center">
            Find Designers <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gray-50 rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join our platform to connect with talented designers, get personalized quotes, and bring your interior design dreams to life.
        </p>
        <Link
          to="/client/requirements/new"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Your Project
        </Link>
      </div>
    </div>
  );
};

export default Home;
