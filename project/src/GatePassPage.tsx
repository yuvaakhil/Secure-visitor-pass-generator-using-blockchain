import { useLocation, useParams } from "react-router-dom";
import QRCode from "qrcode.react";



const GatePassPage = () => {
  const { id } = useParams(); // TX hash or gatePassId
  const location = useLocation();
  const { userData, gatePassId } = location.state || {};

  if (!userData) {
    return <p>Invalid gate pass access</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 shadow-md rounded-lg bg-white">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-4">🎫 Gate Pass Generated</h2>

      <p className="text-center text-sm text-gray-500 mb-8">
        Transaction ID: <code>{gatePassId}</code>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-semibold">Full Name</label>
          <p className="border p-2 rounded">{userData.name}</p>

          <label className="font-semibold mt-4">Aadhaar Number</label>
          <p className="border p-2 rounded">{userData.aadhaarNumber}</p>

          <label className="font-semibold mt-4">Date of Birth</label>
          <p className="border p-2 rounded">{userData.dob}</p>
        </div>

        <div className="flex flex-col items-center">
          <img
            src={userData.photoUrl}
            alt="Face"
            className="w-40 h-40 rounded object-cover border"
          />
          <a
            href={`https://stellar.expert/explorer/futurenet/tx/${gatePassId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
          >
            🔍 View on Blockchain
            <div className="mt-6">
  <h4 className="text-center text-sm text-gray-600 mb-2">Scan QR to verify</h4>
  <QRCode
    value={JSON.stringify({
      name: userData.name,
      aadhaar: userData.aadhaarNumber,
      tx: gatePassId
    })}
    size={128}
    bgColor="#ffffff"
    fgColor="#000000"
    level="H"
  />
</div>

          </a>
        </div>
      </div>
    </div>
  );
};

export default GatePassPage;
