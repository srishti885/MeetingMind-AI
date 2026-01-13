import React from 'react';
import { 
  AlertCircle, 
  DollarSign, 
  ShieldAlert, 
  ArrowRightCircle, 
  CheckCircle2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import './sales.css';

const SalesDashboard = ({ data }) => {
  if (!data) return (
    <div className="flex items-center justify-center p-20 text-gray-400 italic">
       <Sparkles className="animate-pulse mr-2" /> Waiting for Neural Analysis...
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sales-dashboard"
    >
      {/* --- PAIN POINTS (Red Neon) --- */}
      <motion.div variants={cardVariants} className="glass-card neon-border-red">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Pain Points</h3>
          </div>
          <span className="text-[10px] font-extrabold bg-red-100 text-red-600 px-2 py-1 rounded-lg">CRITICAL</span>
        </div>
        <ul className="space-y-4">
          {data.pain_points?.length > 0 ? (
            data.pain_points.map((p, i) => (
              <li key={i} className="group flex items-start gap-3 p-2 rounded-xl hover:bg-red-50/50 transition-colors">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] group-hover:scale-125 transition-transform"></span>
                <span className="text-gray-600 text-sm leading-relaxed">{p}</span>
              </li>
            ))
          ) : <li className="text-gray-400 text-sm italic">Clean slate—no pain points found</li>}
        </ul>
      </motion.div>

      {/* --- BUDGET (Emerald Neon) --- */}
      <motion.div variants={cardVariants} className="glass-card neon-border-green flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <DollarSign size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Budget Intelligence</h3>
          </div>
          <div className="relative inline-block">
             <h2 className="text-4xl font-black text-emerald-600 tracking-tighter mb-2">
                {data.budget_discussed || "TBD"}
             </h2>
             <div className="h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-3/4 animate-pulse"></div>
             </div>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
          <TrendingUp size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">High Conversion Probability</span>
        </div>
      </motion.div>

      {/* --- OBJECTIONS (Amber Neon) --- */}
      <motion.div variants={cardVariants} className="glass-card neon-border-amber">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <ShieldAlert size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">Objections</h3>
        </div>
        <div className="space-y-3">
          {data.objections?.length > 0 ? (
            data.objections.map((o, i) => (
              <div key={i} className="flex items-center gap-3 bg-amber-50/50 p-3 rounded-2xl border border-amber-100/50">
                <div className="w-1.5 h-6 bg-amber-400 rounded-full"></div>
                <p className="text-gray-700 text-sm font-medium">{o}</p>
              </div>
            ))
          ) : <p className="text-gray-400 text-sm italic">Smooth sailing—no objections recorded</p>}
        </div>
      </motion.div>

      {/* --- NEXT STEPS (Blue Neon) --- */}
      <motion.div variants={cardVariants} className="glass-card neon-border-blue bg-slate-900 !text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
            <ArrowRightCircle size={24} />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Action Roadmap</h3>
        </div>
        <div className="space-y-4">
          {data.next_steps?.length > 0 ? (
            data.next_steps.map((s, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <CheckCircle2 size={20} className="text-blue-400 group-hover:scale-125 transition-transform" />
                <span className="text-slate-300 text-sm font-medium border-b border-slate-800 pb-2 w-full">{s}</span>
              </div>
            ))
          ) : <p className="text-slate-500 text-sm italic">Awaiting strategic next steps...</p>}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SalesDashboard;