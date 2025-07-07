import React, { useState, useRef } from 'react';
import { QrCode, Camera, CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';

interface VerificationResult {
  isValid: boolean;
  passId: string;
  holderName: string;
  issueDate: string;
  validUntil: string;
  photoUrl: string;
  blockchainHash: string;
}

const Verify: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [manualId, setManualId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateQRScan = async () => {
    setScanning(true);
    setError('');
    
    // Simulate QR code scanning
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setScanning(false);
    performVerification('ABC123XYZ');
  };

  const performVerification = async (passId: string) => {
    setVerifying(true);
    setError('');
    
    // Simulate blockchain verification
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock verification result (80% chance of valid pass)
    const isValid = Math.random() > 0.2;
    
    if (isValid) {
      const mockResult: VerificationResult = {
        isValid: true,
        passId: passId,
        holderName: 'Rajesh Kumar Singh',
        issueDate: new Date().toLocaleDateString('en-IN'),
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        photoUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        blockchainHash: `0x${Math.random().toString(16).substr(2, 32)}`
      };
      setResult(mockResult);
    } else {
      setResult({
        isValid: false,
        passId: passId,
        holderName: '',
        issueDate: '',
        validUntil: '',
        photoUrl: '',
        blockchainHash: ''
      });
    }
    
    setVerifying(false);
  };

  const handleManualVerification = () => {
    if (!manualId.trim()) {
      setError('Please enter a valid Pass ID');
      return;
    }
    performVerification(manualId.trim());
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setError('');
    
    // Simulate QR code reading from image
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setScanning(false);
    performVerification('IMG456QRS');
  };

  const resetVerification = () => {
    setResult(null);
    setError('');
    setManualId('');
  };

  if (verifying) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            <Loader className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Verifying Gate Pass
            </h3>
            <p className="text-gray-600 mb-6">
              Checking blockchain records and validating pass authenticity...
            </p>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {result.isValid ? (
            <>
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Pass Verified ✓</h2>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">
                  ✅ Valid gate pass confirmed through blockchain verification
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-3 bg-gray-100 rounded-lg overflow-hidden border-2 border-green-200">
                    <img 
                      src={result.photoUrl} 
                      alt="Pass Holder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Verified Photo</p>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Pass Holder</p>
                    <p className="font-semibold text-gray-900">{result.holderName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pass ID</p>
                    <p className="font-mono text-gray-900">{result.passId}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Issue Date</p>
                      <p className="font-semibold text-gray-900">{result.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valid Until</p>
                      <p className="font-semibold text-gray-900">{result.validUntil}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Blockchain Verification</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Verified on Soroban smart contract
                </p>
                <p className="text-xs text-blue-600 font-mono break-all">
                  Hash: {result.blockchainHash}...
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-3 mb-6">
                <XCircle className="h-8 w-8 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Invalid Pass ❌</h2>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-medium">
                  ❌ This gate pass is invalid, expired, or does not exist in our blockchain records
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Security Alert</h4>
                    <p className="text-sm text-yellow-700">
                      Pass ID: <span className="font-mono">{result.passId}</span> not found in blockchain records. 
                      This could indicate a forged or expired pass.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <button
            onClick={resetVerification}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Verify Another Pass
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Gate Pass</h1>
        <p className="text-gray-600">
          Scan QR code or enter Pass ID to verify authenticity through blockchain
        </p>
      </div>

      <div className="space-y-6">
        {/* QR Code Scanning */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>QR Code Scanning</span>
          </h3>
          
          {scanning ? (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <Camera className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              </div>
              <p className="text-gray-600">Scanning QR code...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={simulateQRScan}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  <span>Scan with Camera</span>
                </button>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <QrCode className="h-5 w-5" />
                  <span>Upload QR Image</span>
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <p className="text-sm text-gray-500 text-center">
                Point your camera at the QR code or upload an image containing the QR code
              </p>
            </div>
          )}
        </div>

        {/* Manual Entry */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Verification</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Pass ID
              </label>
              <input
                type="text"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                placeholder="e.g., ABC123XYZ"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            
            <button
              onClick={handleManualVerification}
              disabled={!manualId.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Verify Pass
            </button>
          </div>
        </div>

        {/* Information */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">How Verification Works</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• QR codes contain encrypted pass information</li>
            <li>• Each pass is verified against Soroban blockchain records</li>
            <li>• Real-time validation ensures pass authenticity</li>
            <li>• Tampered or expired passes are immediately detected</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Verify;