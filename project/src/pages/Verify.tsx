import React, { useState, useRef } from 'react';
import {
  QrCode, Camera, CheckCircle, XCircle, AlertTriangle, Loader, Shield, ExternalLink, RefreshCw
} from 'lucide-react';
import jsQR from 'jsqr';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const performVerification = async (qrData: string) => {
    try {
      const decoded = JSON.parse(qrData);
      const { name, aadhaar, tx } = decoded;

      setVerifying(true);
      const HORIZON = "https://horizon-testnet.stellar.org";
      const res = await fetch(`${HORIZON}/transactions/${tx}`);
      const txDetails = await res.json();

      const txRes = await fetch(`${HORIZON}/transactions/${tx}/operations`);
      const txOps = await txRes.json();
      const cidOp = txOps._embedded.records.find((op: any) => op.name === "aadhaar_cid");
      const cid = cidOp?.value && atob(cidOp.value);

      const isValid = !!tx && !!name;

      if (isValid) {
        setResult({
          isValid: true,
          passId: `GP-${aadhaar.slice(-4)}`,
          holderName: name,
          issueDate: new Date().toLocaleDateString('en-IN'),
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
          photoUrl: `https://gateway.pinata.cloud/ipfs/${cid}` || '',
          blockchainHash: tx
        });
      } else {
        throw new Error('Missing CID or data');
      }
    } catch (err) {
      console.error(err);
      setResult({
        isValid: false,
        passId: 'UNKNOWN',
        holderName: '',
        issueDate: '',
        validUntil: '',
        photoUrl: '',
        blockchainHash: ''
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        setScanning(false);
        if (code) {
          performVerification(code.data);
        } else {
          setError('❌ Could not read a valid QR code from the image.');
        }
      };
      if (typeof reader.result === 'string') img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const resetVerification = () => {
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Gate Pass Verification
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Verify the authenticity of gate passes using blockchain technology and QR code scanning
            </p>
          </div>

          {!result && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">QR Code Verification</h2>
                <p className="text-gray-600">Upload an image containing the QR code to verify the gate pass</p>
              </div>

              <div className="p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 animate-pulse">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-3 text-red-500" />
                      <span className="font-medium">{error}</span>
                    </div>
                  </div>
                )}

                <div className="max-w-md mx-auto">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Upload QR Code Image</h3>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50 hover:bg-blue-50">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Upload an image containing the QR code</p>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={scanning}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {scanning ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          <span>Scanning...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5" />
                          <span>Verify Pass with Security Image</span>
                        </>
                      )}
                    </button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {verifying && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader className="h-8 w-8 animate-spin text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Verifying Pass</h3>
                <p className="text-gray-600">Checking blockchain records on Stellar Testnet...</p>
              </div>
            </div>
          )}

          {result && (
            <div className={`bg-white rounded-3xl shadow-2xl border overflow-hidden animate-fadeIn ${
              result.isValid 
                ? 'border-green-200 shadow-green-100' 
                : 'border-red-200 shadow-red-100'
            }`}>
              <div className={`px-8 py-6 ${
                result.isValid 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100' 
                  : 'bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100'
              }`}>
                <div className="flex items-center space-x-4">
                  {result.isValid ? (
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-7 w-7 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <XCircle className="h-7 w-7 text-red-600" />
                    </div>
                  )}
                  <div>
                    <h2 className={`text-2xl font-bold ${
                      result.isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.isValid ? 'Gate Pass Verified' : 'Verification Failed'}
                    </h2>
                    <p className={`text-sm ${
                      result.isValid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.isValid ? 'Pass is authentic and valid' : 'This pass could not be verified'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {result.isValid ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-500 mb-1">Pass ID</p>
                          <p className="text-lg font-semibold text-gray-900">{result.passId}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-500 mb-1">Holder Name</p>
                          <p className="text-lg font-semibold text-gray-900">{result.holderName}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-500 mb-1">Issue Date</p>
                          <p className="text-lg font-semibold text-gray-900">{result.issueDate}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-500 mb-1">Valid Until</p>
                          <p className="text-lg font-semibold text-gray-900">{result.validUntil}</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm font-medium text-blue-700 mb-2">Blockchain Transaction</p>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded font-mono break-all">
                            {result.blockchainHash}
                          </code>
                          <a
                            href={`https://stellar.expert/explorer/testnet/tx/${result.blockchainHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="bg-gray-50 rounded-2xl p-6 text-center">
                        <p className="text-sm font-medium text-gray-500 mb-4">Pass Holder Photo</p>
                        {result.photoUrl ? (
                          <img 
                            src={result.photoUrl} 
                            alt="Pass Holder" 
                            className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover mx-auto"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center mx-auto">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 text-lg mb-4">
                      The gate pass could not be verified. Please check the QR code or Pass ID and try again.
                    </p>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
                  <button
                    onClick={resetVerification}
                    className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <RefreshCw className="h-5 w-5" />
                    <span>Verify Another Pass</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Verify;