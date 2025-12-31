// import React from 'react';
// import { Heart, Users, Clock, Droplet } from 'lucide-react';
// import StatCard from '../components/StatCard';
// import DonorForm from '../components/DonorForm';
// import useDonors from '../hooks/useDonors';

// export default function HomePage({ setPage }) {
//   const { stats, addDonor } = useDonors();

//   const handleSuccessfulSubmit = (newDonor) => {
//     addDonor(newDonor);
//     // Auto redirect to dashboard after successful registration
//     setTimeout(() => setPage('dashboard'), 1800);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Hero Header */}
//         <header className="text-center mb-12">
//           <div className="flex items-center justify-center mb-4">
//             <Heart className="w-16 h-16 text-red-600 fill-red-600 animate-pulse" />
//           </div>
//           <h1 className="text-5xl font-bold text-gray-800 mb-4">LifeFlow Blood Bank</h1>
//           <p className="text-xl text-gray-600">Save Lives. Donate Blood. Be a Hero.</p>
//         </header>

//         {/* Live Stats Cards */}
//         <div className="grid md:grid-cols-3 gap-6 mb-12">
//           <StatCard icon={Users} title="Total Registered Donors" value={stats.total} colorClass="text-blue-600" />
//           <StatCard icon={Clock} title="Registrations Today" value={stats.today} colorClass="text-green-600" />
//           <StatCard icon={Droplet} title="Emergency Support" value="24/7" colorClass="text-red-600" />
//         </div>

//         {/* Registration Form Section */}
//         <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
//           <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//             Register as a Blood Donor
//           </h2>
//           <DonorForm onSubmitSuccess={handleSuccessfulSubmit} />

//           {/* Link to Dashboard */}
//           <div className="mt-8 text-center">
//             <button
//               onClick={() => setPage('dashboard')}
//               className="text-red-600 hover:text-red-700 font-semibold underline transition-colors"
//             >
//               View Donor Dashboard →
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react';
import DonorForm from '../components/DonorForm';
import StatCard from '../components/StatCard';
import { Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import useDonors from '../hooks/useDonors';

const HomePage = () => {
  const { stats, addDonor } = useDonors();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Become a Life Saver</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join our network of heroes. Your single donation can save up to 3 lives.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <StatCard
            title="Total Donors"
            value={stats.total}
            icon={<Users className="w-8 h-8" />}
            color="blue"
            description="Active in our network"
          />
          
          <StatCard
            title="Today's Registrations"
            value={stats.today}
            icon={<Clock className="w-8 h-8" />}
            color="green"
            description="New donors today"
          />
          
          <StatCard
            title="Urgent Need"
            value={stats.urgentTypes?.length || 0}
            icon={<AlertTriangle className="w-8 h-8" />}
            color="red"
            description="Blood types needed"
          />
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">Donation Eligibility</h3>
            <ul className="space-y-3">
              {[
                'Age: 18-65 years',
                'Weight: >50kg',
                'Hemoglobin: >12.5g/dL',
                'No illness in last 2 weeks',
                'Last donation: >3 months ago'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle Column - Registration Form */}
        <div className="lg:col-span-2">
          <DonorForm onSubmit={addDonor} />
        </div>
      </div>

      {/* Quick Facts Section */}
      <div className="mt-12 grid md:grid-cols-4 gap-6">
        {[
          { title: 'Donation Time', value: '10-15 mins', desc: 'Quick process' },
          { title: 'Blood Volume', value: '450ml', desc: 'Per donation' },
          { title: 'Recovery Time', value: '24-48 hrs', desc: 'Full recovery' },
          { title: 'Can Donate Every', value: '3 months', desc: 'For males' },
        ].map((fact, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 text-center shadow">
            <div className="text-2xl font-bold text-red-600">{fact.value}</div>
            <div className="font-semibold text-gray-800">{fact.title}</div>
            <div className="text-sm text-gray-500">{fact.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;