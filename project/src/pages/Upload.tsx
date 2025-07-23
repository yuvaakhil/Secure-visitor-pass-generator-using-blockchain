import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Image, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Server, TransactionBuilder, Memo, Networks, Operation, Transaction } from "stellar-sdk";
import albedo from "@albedo-link/intent";

interface OCRResult {
  name: string;
  aadhaarNumber: string;
  photoUrl: string;
}


const Upload: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [ipfsCid, setIpfsCid] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string>('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const res = await albedo.publicKey({ network: "testnet" });
      setPublicKey(res.pubkey);
      setWalletConnected(true);
    } catch (err) {
      console.error("Wallet connect failed:", err);
      alert("Failed to connect wallet");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    setUploading(true);
    setProcessing(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append("aadhaar", file);

      const response = await fetch("http://localhost:3001/api/ocr/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process Aadhaar card");

      const data = await response.json();
      setOcrResult(data);
      const ipfsForm = new FormData();
    ipfsForm.append("photo", file);
    const ipfsResponse = await fetch("http://localhost:3001/api/ipfs/upload", {
      method: "POST",
      body: ipfsForm,
    });
    if (!ipfsResponse.ok) throw new Error("Failed to upload photo to IPFS");
    const ipfsData = await ipfsResponse.json();
    setIpfsCid(ipfsData.cid);
  } 

     catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during OCR");
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileUpload(files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFileUpload(files[0]);
  };

  const generateGatePass = async () => {
    const HORIZON = "https://horizon-testnet.stellar.org";
    const PASSPHRASE = Networks.TESTNET;

    try {
      if (!publicKey) {
        alert("Please connect your wallet first");
        return;
      }

      const server = new Server(HORIZON);
      const account = await server.loadAccount(publicKey);
      const fee = await server.fetchBaseFee();
      const timestamp = new Date().toISOString(); // e.g., 2025-07-23T04:43:32.123Z
      
      const tx = new TransactionBuilder(account, {
        fee,
        networkPassphrase: PASSPHRASE,
      })
        .addMemo(Memo.text(`Gate:${ocrResult?.aadhaarNumber || "XXXX"}`))
        .addOperation(
    Operation.manageData({
      name: "gate_pass_id",
      value:  `GP-${Date.now()}`,
    })
  )
  .addOperation(
    Operation.manageData({
      name: "visitor_name",
      value: ocrResult?.name || "Unknown",
    })
  )
  .addOperation(
    Operation.manageData({
      name: "datetime",
      value: timestamp,
    })
  )
  .addOperation(
  Operation.manageData({
    name: "aadhaar_cid",
    value: ipfsCid || "missing",
  })
)      
  .setTimeout(30)
        .build();

      const signed = await albedo.tx({
        xdr: tx.toXDR("base64"),
        network: "testnet",
      });

      if (!signed.signed_envelope_xdr) {
        throw new Error("Albedo did not return a signed XDR");
      }

      const transaction = TransactionBuilder.fromXDR(signed.signed_envelope_xdr, PASSPHRASE);
      const result = await server.submitTransaction(transaction);

      const gatePassId = `GP-${Date.now()}`;
      navigate(`/gatepass/${gatePassId}`, {
        state: {
          gatePassId,
          userData: ocrResult,
          txHash: result.hash,
        },
      });

    } catch (err: any) {
      console.error("Gate pass generation failed:", err);
      alert("Failed to generate gate pass: " + (err.message || "Unknown error"));
    }
  };

  if (processing) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            <Loader className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {uploading ? 'Uploading Image...' : 'Processing OCR...'}
            </h3>
            <p className="text-gray-600 mb-6">
              {uploading 
                ? 'Securely uploading your Aadhaar card image'
                : 'Extracting information from your Aadhaar card using advanced OCR'
              }
            </p>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (ocrResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">OCR Successful</h2>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">
              Successfully extracted information from your Aadhaar card. Please verify the details below.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 mb-8">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={ocrResult.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                  <input 
                    type="text" 
                    value={`XXXX XXXX ${ocrResult.aadhaarNumber?.slice(-4) ?? "Not found"}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Photo</h3>
              <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                <img 
                  src={ipfsCid ? `https://gateway.pinata.cloud/ipfs/${ipfsCid}` : ocrResult.photoUrl}
                  alt="Extracted from Aadhaar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {!walletConnected ? (
            <button
              onClick={connectWallet}
              className="w-full mb-4 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Connect Wallet with Albedo
            </button>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm break-words">
                Connected Wallet: <strong>{publicKey}</strong>
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={generateGatePass}
              disabled={!walletConnected}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                walletConnected
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Generate Gate Pass
            </button>
            <button
              onClick={() => {
                setOcrResult(null);
                setError('');
                setWalletConnected(false);
                setPublicKey(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Upload New
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Aadhaar Card</h1>
        <p className="text-gray-600">
          Upload your Aadhaar card image to generate a secure digital gate pass
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <div className="mb-4">
            <UploadIcon className="h-12 w-12 text-gray-400 mx-auto" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Drop your Aadhaar card here
          </h3>
          <p className="text-gray-600 mb-4">or click to browse files</p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Choose File
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Image className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Supported Formats</h4>
              <p className="text-sm text-gray-600">
                JPG, PNG, WebP - Maximum file size: 10MB
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Ensure the Aadhaar card is clearly visible and well-lit for best OCR results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
