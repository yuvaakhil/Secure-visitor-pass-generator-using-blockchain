import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Lock, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-6">
          <Shield className="h-20 w-20 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            SecurePass
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Blockchain-powered digital gate pass system using Aadhaar verification 
            and Soroban smart contracts for maximum security and transparency.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/upload" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            <span>Generate Gate Pass</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link 
            to="/verify" 
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Verify Pass
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">OCR Extraction</h3>
          <p className="text-gray-600">
            Advanced OCR technology extracts name and photo from Aadhaar cards 
            automatically with high precision.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Blockchain Security</h3>
          <p className="text-gray-600">
            Aadhaar data hashes stored on Soroban smart contracts ensure 
            tamper-proof verification and data integrity.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Verification</h3>
          <p className="text-gray-600">
            Instant QR code scanning with real-time blockchain verification 
            for seamless access control.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              1
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Upload Aadhaar</h4>
            <p className="text-sm text-gray-600">
              Upload your Aadhaar card image for OCR processing
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              2
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">OCR Processing</h4>
            <p className="text-sm text-gray-600">
              AI extracts name and photo data automatically
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              3
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Blockchain Hash</h4>
            <p className="text-sm text-gray-600">
              Data hash stored securely on Soroban smart contract
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              4
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Generate Pass</h4>
            <p className="text-sm text-gray-600">
              QR code gate pass created for secure access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;