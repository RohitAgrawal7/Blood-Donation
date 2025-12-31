// import React from 'react';
// import { Users, Clock, Droplet, Heart } from 'lucide-react';
// import useDonors from '../hooks/useDonors';
// import BloodTypeDistribution from '../components/BloodTypeDistribution';
// import RecentDonorsTable from '../components/RecentDonorsTable';

// export default function DashboardPage({ setPage }) {
//   const { donors, stats } = useDonors();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <header className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">Donor Dashboard</h1>
//           <p className="text-gray-600">Real-time donor statistics and blood type availability</p>
//         </header>

//         {/* Top Stats Cards */}
//         <div className="grid md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
//             <Users className="w-10 h-10 mb-3 opacity-80" />
//             <h3 className="text-3xl font-bold mb-1">{stats.total}</h3>
//             <p className="text-blue-100">Total Donors</p>
//           </div>
//           <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
//             <Clock className="w-10 h-10 mb-3 opacity-80" />
//             <h3 className="text-3xl font-bold mb-1">{stats.today}</h3>
//             <p className="text-green-100">Today's Registrations</p>
//           </div>
//           <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
//             <Droplet className="w-10 h-10 mb-3 opacity-80" />
//             <h3 className="text-3xl font-bold mb-1">{Object.keys(stats.byBloodType).length}</h3>
//             <p className="text-purple-100">Blood Types Available</p>
//           </div>
//           <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
//             <Heart className="w-10 h-10 mb-3 opacity-80 fill-white" />
//             <h3 className="text-3xl font-bold mb-1">{stats.total * 450}ml</h3>
//             <p className="text-red-100">Potential Blood Volume</p>
//           </div>
//         </div>

//         {/* Blood Type Distribution */}
//         <BloodTypeDistribution byBloodType={stats.byBloodType} />

//         {/* Recent Donors Table */}
//         <RecentDonorsTable donors={donors} className="mt-8" />

//         {/* Back Button */}
//         <div className="mt-12 text-center">
//           <button
//             onClick={() => setPage('home')}
//             className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
//           >
//             ← Back to Registration
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react';
import { 
  BarChart3, PieChart, TrendingUp, Calendar, 
  MapPin, Activity, Target, Shield
} from 'lucide-react';
import useDonors from '../hooks/useDonors';
import BloodTypeDistribution from '../components/BloodTypeDistribution';
import BloodStockChart from '../components/BloodStockChart';

const DashboardPage = () => {
  const { stats, donors } = useDonors();

  const monthlyTrend = calculateMonthlyTrend(donors);
  const cityDistribution = calculateCityDistribution(donors);
  const eligibilityRate = (stats.approved / stats.total * 100).toFixed(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights and metrics</p>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            title: 'Approval Rate', 
            value: `${eligibilityRate}%`,
            icon: <Target className="w-8 h-8" />,
            color: 'green',
            change: '+2.4%'
          },
          { 
            title: 'Avg Donations', 
            value: '1.8',
            icon: <Activity className="w-8 h-8" />,
            color: 'blue',
            change: 'Per donor'
          },
          { 
            title: 'Top City', 
            value: cityDistribution[0]?.city || 'N/A',
            icon: <MapPin className="w-8 h-8" />,
            color: 'purple',
            change: `${cityDistribution[0]?.count || 0} donors`
          },
          { 
            title: 'Satisfaction', 
            value: '98%',
            icon: <Shield className="w-8 h-8" />,
            color: 'yellow',
            change: 'Donor feedback'
          },
        ].map((metric, idx) => (
          <div key={idx} className={`bg-${metric.color}-50 rounded-2xl p-6 border-${metric.color}-200 border`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-bold text-gray-800">{metric.value}</div>
                <div className="text-sm text-gray-600 mt-1">{metric.title}</div>
              </div>
              <div className={`text-${metric.color}-600`}>
                {metric.icon}
              </div>
            </div>
            <div className={`text-sm text-${metric.color}-700 mt-4`}>{metric.change}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Blood Type Distribution</h2>
            <PieChart className="text-red-600" />
          </div>
          <BloodTypeDistribution data={stats.byBloodType} />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Monthly Registrations</h2>
            <TrendingUp className="text-blue-600" />
          </div>
          <BloodStockChart data={monthlyTrend} />
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">Demographics</h3>
          <div className="space-y-4">
            {[
              { label: 'Age 18-25', value: '32%', color: 'bg-blue-500' },
              { label: 'Age 26-35', value: '45%', color: 'bg-green-500' },
              { label: 'Age 36-50', value: '18%', color: 'bg-yellow-500' },
              { label: 'Age 51+', value: '5%', color: 'bg-red-500' },
            ].map((demo, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{demo.label}</span>
                  <span className="font-semibold">{demo.value}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${demo.color} rounded-full`}
                    style={{ width: demo.value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2">
          <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {donors.slice(-5).reverse().map(donor => (
              <div key={donor.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    donor.status === 'approved' ? 'bg-green-500' :
                    donor.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <div className="font-medium">{donor.fullName}</div>
                    <div className="text-sm text-gray-500">{donor.city} • {donor.bloodType}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(donor.registeredAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const calculateMonthlyTrend = (donors) => {
  const months = {};
  donors.forEach(donor => {
    const month = new Date(donor.registeredAt).toLocaleString('default', { month: 'short' });
    months[month] = (months[month] || 0) + 1;
  });
  return Object.entries(months).map(([month, count]) => ({ month, count }));
};

const calculateCityDistribution = (donors) => {
  const cities = {};
  donors.forEach(donor => {
    cities[donor.city] = (cities[donor.city] || 0) + 1;
  });
  return Object.entries(cities)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);
};

export default DashboardPage;