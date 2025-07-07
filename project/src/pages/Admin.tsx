import React, { useState } from 'react';
import { BarChart3, Users, Shield, Activity, Download, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

interface GatePassRecord {
  id: string;
  holderName: string;
  issueDate: string;
  status: 'active' | 'expired' | 'revoked';
  lastVerified: string;
  blockchainHash: string;
}

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'passes' | 'analytics'>('dashboard');
  
  // Mock data
  const stats = {
    totalPasses: 1247,
    activePasses: 892,
    verificationsToday: 156,
    blockchainTransactions: 1247
  };

  const recentPasses: GatePassRecord[] = [
    {
      id: 'ABC123XYZ',
      holderName: 'Rajesh Kumar Singh',
      issueDate: '2024-01-15',
      status: 'active',
      lastVerified: '2024-01-15 14:30',
      blockchainHash: '0x7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c'
    },
    {
      id: 'DEF456ABC',
      holderName: 'Priya Sharma',
      issueDate: '2024-01-14',
      status: 'active',
      lastVerified: '2024-01-15 12:15',
      blockchainHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d'
    },
    {
      id: 'GHI789DEF',
      holderName: 'Amit Patel',
      issueDate: '2024-01-13',
      status: 'expired',
      lastVerified: '2024-01-14 09:45',
      blockchainHash: '0x5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      revoked: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Passes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPasses.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Passes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activePasses.toLocaleString()}</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+8% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verifications Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.verificationsToday}</p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+24% from yesterday</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Blockchain Txns</p>
              <p className="text-3xl font-bold text-gray-900">{stats.blockchainTransactions.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+15% from last month</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Gate Passes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Pass ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Holder Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Issue Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Last Verified</th>
              </tr>
            </thead>
            <tbody>
              {recentPasses.map((pass) => (
                <tr key={pass.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{pass.id}</td>
                  <td className="py-3 px-4">{pass.holderName}</td>
                  <td className="py-3 px-4">{pass.issueDate}</td>
                  <td className="py-3 px-4">{getStatusBadge(pass.status)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{pass.lastVerified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PassesView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">All Gate Passes</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search passes..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Expired</option>
              <option>Revoked</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Pass ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Holder Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Issue Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Blockchain Hash</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentPasses.map((pass) => (
                <tr key={pass.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{pass.id}</td>
                  <td className="py-3 px-4">{pass.holderName}</td>
                  <td className="py-3 px-4">{pass.issueDate}</td>
                  <td className="py-3 px-4">{getStatusBadge(pass.status)}</td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-600">
                    {pass.blockchainHash.substring(0, 16)}...
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pass Generation Trends</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Patterns</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Suspicious Verification Pattern</p>
                <p className="text-xs text-yellow-600">Multiple failed verifications from IP 192.168.1.100</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Blockchain Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Network Status</span>
              <span className="text-green-600 font-medium">✓ Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Block</span>
              <span className="text-gray-900 font-mono text-sm">#2,847,592</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Gas Price</span>
              <span className="text-gray-900">0.00001 XLM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage and monitor the SecurePass system</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('passes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'passes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Gate Passes</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Analytics</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'passes' && <PassesView />}
      {activeTab === 'analytics' && <AnalyticsView />}
    </div>
  );
};

export default Admin;