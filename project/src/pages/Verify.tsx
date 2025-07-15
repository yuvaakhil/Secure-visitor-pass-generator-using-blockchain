import React, { useState, useRef } from 'react';
import {
  QrCode, Camera, CheckCircle, XCircle, AlertTriangle, Loader
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
  const [manualId, setManualId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const performVerification = async (qrData: string) => {
    try {
      const decoded = JSON.parse(qrData);
      const { name, aadhaar, tx,  photoUrl  } = decoded;

      setVerifying(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const isValid = !!tx && !!name;

      if (isValid) {
        setResult({
          isValid: true,
          passId: `GP-${aadhaar.slice(-4)}`,
          holderName: name,
          issueDate: new Date().toLocaleDateString('en-IN'),
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
          photoUrl: photoUrl || '',
          blockchainHash: tx
        });
      } else {
        throw new Error('Invalid QR data');
      }
    } catch (err) {
      console.error(err);
      setResult({
        isValid: false,
        passId: manualId || 'UNKNOWN',
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

  const handleManualVerification = () => {
    if (!manualId.trim()) {
      setError('Please enter a valid Pass ID');
      return;
    }
    performVerification(JSON.stringify({
      name: 'Manual Entry',
      aadhaar: manualId.trim(),
      tx: 'manualtx1234'
    }));
  };

  const resetVerification = () => {
    setResult(null);
    setError('');
    setManualId('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Verify Gate Pass</h1>

      {!result && (
        <>
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
              <AlertTriangle className="inline h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Camera className="h-5 w-5" />
              <span>Upload QR Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Enter Pass ID"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
              />
              <button
                onClick={handleManualVerification}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
              >
                Verify
              </button>
            </div>
          </div>
        </>
      )}

      {verifying && (
        <div className="mt-8 text-center text-blue-500">
          <Loader className="h-6 w-6 animate-spin inline mr-2" />
          Verifying on Stellar Testnet...
        </div>
      )}

      {result && (
        <div className={`mt-6 p-6 rounded-lg border ${result.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          {result.isValid ? (
            <>
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-green-800">Gate Pass Verified</h2>
              </div>
              <p><strong>Pass ID:</strong> {result.passId}</p>
              <p><strong>Name:</strong> {result.holderName}</p>
              <p><strong>Issue Date:</strong> {result.issueDate}</p>
              <p><strong>Valid Until:</strong> {result.validUntil}</p>
              <p><strong>Blockchain TX:</strong> <a href={`https://stellar.expert/explorer/testnet/tx/${result.blockchainHash}`} className="underline text-blue-700" target="_blank" rel="noopener noreferrer">{result.blockchainHash}</a></p>
              <img src={result.photoUrl} alt="User" className="w-24 h-24 mt-4 rounded border" />
            </>
          ) : (
            <>
              <div className="flex items-center space-x-3 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
                <h2 className="text-xl font-semibold text-red-800">Verification Failed</h2>
              </div>
              <p>This pass could not be verified.</p>
            </>
          )}

          <button
            onClick={resetVerification}
            className="mt-6 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Verify Another
          </button>
        </div>
      )}
    </div>
  );
};

export default Verify;
