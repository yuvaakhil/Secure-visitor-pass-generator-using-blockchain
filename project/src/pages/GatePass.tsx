// GatePass.tsx (updated for Testnet-based TX hash verification and clean QR)
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Download, Share2, CheckCircle, QrCode as QrCodeIcon, Calendar, Clock, User } from 'lucide-react';
import QRCode from 'react-qr-code';


interface UserData {
  name: string;
  aadhaarNumber: string;
  photoUrl: string;
}

interface LocationState {
  userData: UserData;
  gatePassId: string;
  txHash?: string;
}

const GatePass: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  const state = location.state as LocationState;
  const userData = state?.userData;
  const gatePassId = state?.gatePassId || id;
  const txHash = state?.txHash || "";

  const currentDate = new Date().toLocaleDateString('en-IN');
  const validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');

  useEffect(() => {
    if (txHash) setQrGenerated(true);
  }, [txHash]);

  const downloadPass = () => {
    alert('Download functionality would generate a PDF of the gate pass');
  };

  const sharePass = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SecurePass Gate Pass',
        text: `Gate Pass ID: ${gatePassId}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Gate pass link copied to clipboard');
    }
  };

  if (!userData) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Gate Pass Not Found</h2>
          <p className="text-red-600 mb-4">
            The gate pass you're looking for doesn't exist or has expired.
          </p>
          <Link 
            to="/upload" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Generate New Pass
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
        <CheckCircle className="h-6 w-6 text-green-600" />
        <div>
          <h3 className="font-semibold text-green-800">Gate Pass Generated Successfully!</h3>
          <p className="text-green-600 text-sm">
            Your data has been recorded on the Stellar Testnet blockchain.
          </p>
        </div>
      </div>

      {/* Digital Gate Pass */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">DIGITAL GATE PASS</h1>
              <p className="text-blue-100">SecurePass System</p>
            </div>
            <QrCodeIcon className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        {/* Pass Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* User Photo */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-3 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                <img 
                  src={userData.photoUrl} 
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600">Verified Photo</p>
            </div>

            {/* User Details */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold text-gray-900">{userData.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Issue Date</p>
                  <p className="font-semibold text-gray-900">{currentDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Valid Until</p>
                  <p className="font-semibold text-gray-900">{validUntil}</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Scan this code for instant verification
                </p>
                <p className="text-xs text-gray-500">
                  Pass ID: <span className="font-mono">{gatePassId}</span>
                </p>
              </div>
              <div className="flex justify-center">
                <div ref={qrRef} className="bg-white p-4 rounded-lg border-2 border-gray-200">


                  <QRCode
                    value={JSON.stringify({
                      name: userData.name,
                      aadhaar: userData.aadhaarNumber,
                      tx: txHash
                    })}
                    size={150}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Verification */}
          {txHash && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Blockchain Verified</h4>
                </div>
                <p className="text-sm text-blue-700">
                  This gate pass is recorded on the Stellar Testnet. You can verify the details using the transaction hash.
                </p>
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 mt-2 font-mono underline block"
                >
                  TX Hash: {txHash}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={downloadPass}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Download Pass</span>
        </button>
        <button
          onClick={sharePass}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default GatePass;
