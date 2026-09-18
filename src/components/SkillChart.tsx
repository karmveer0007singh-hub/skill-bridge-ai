import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { UserSkill, SkillGap } from '../types';
import { Layers, BarChart3 } from 'lucide-react';

interface SkillChartProps {
  currentSkills: UserSkill[];
  skillGaps: SkillGap[];
  targetCareer: string;
}

export const SkillChart: React.FC<SkillChartProps> = ({
  currentSkills,
  skillGaps,
  targetCareer,
}) => {
  const [chartType, setChartType] = useState<'bar' | 'radar'>('bar');

  // Prepare data for horizontal comparison bar chart
  const barData = [
    ...currentSkills.slice(0, 5).map((s) => ({
      name: s.name.length > 16 ? s.name.substring(0, 15) + '...' : s.name,
      current: s.score || 75,
      required: 85,
      type: 'Current Skill',
    })),
    ...skillGaps.slice(0, 4).map((g) => ({
      name: g.name.length > 16 ? g.name.substring(0, 15) + '...' : g.name,
      current: g.currentScore || 20,
      required: g.requiredScore || 80,
      type: 'Skill Gap',
    })),
  ];

  // Prepare data for radar competency dimensions
  const radarData = [
    {
      subject: 'Languages',
      Student: currentSkills.some((s) => s.category.includes('Language') || s.name.includes('JavaScript') || s.name.includes('Python')) ? 80 : 45,
      IndustryBenchmark: 85,
    },
    {
      subject: 'Frameworks',
      Student: currentSkills.some((s) => s.category.includes('Frontend') || s.name.includes('React')) ? 75 : 40,
      IndustryBenchmark: 80,
    },
    {
      subject: 'Testing & QA',
      Student: skillGaps.some((g) => g.name.includes('Testing') || g.category.includes('Testing')) ? 25 : 70,
      IndustryBenchmark: 75,
    },
    {
      subject: 'Architecture',
      Student: currentSkills.some((s) => s.name.includes('Architecture')) ? 70 : 40,
      IndustryBenchmark: 80,
    },
    {
      subject: 'Dev Tools & Git',
      Student: currentSkills.some((s) => s.name.includes('Git')) ? 80 : 50,
      IndustryBenchmark: 80,
    },
    {
      subject: 'Performance',
      Student: skillGaps.some((g) => g.name.includes('Performance')) ? 30 : 65,
      IndustryBenchmark: 75,
    },
  ];

  return (
    <div
      id="skill-benchmark-chart"
      className="glass-card-elevated p-6 rounded-3xl border border-[rgba(75,180,220,0.28)] shadow-[0_15px_40px_rgba(0,0,0,0.5)] text-[#F4FAFF]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[rgba(75,180,220,0.2)]">
        <div>
          <h3 className="text-base font-bold text-[#F4FAFF] font-display">
            Competency Benchmark Matrix
          </h3>
          <p className="text-xs text-[#91A4BD]">
            Comparing your verified skills vs <span className="font-medium text-[#35E7FF] font-mono">{targetCareer}</span> hiring criteria
          </p>
        </div>

        <div className="flex items-center bg-[#06152B] p-1 rounded-xl border border-[rgba(75,180,220,0.25)]">
          <button
            id="btn-toggle-bar-chart"
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
              chartType === 'bar'
                ? 'bg-[#16E0FF] text-[#020817] font-bold shadow-[0_0_10px_rgba(22,224,255,0.3)]'
                : 'text-[#91A4BD] hover:text-[#F4FAFF]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Comparison
          </button>
          <button
            id="btn-toggle-radar-chart"
            onClick={() => setChartType('radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
              chartType === 'radar'
                ? 'bg-[#16E0FF] text-[#020817] font-bold shadow-[0_0_10px_rgba(22,224,255,0.3)]'
                : 'text-[#91A4BD] hover:text-[#F4FAFF]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Radar View
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 100]} unit="%" stroke="#657A95" fontSize={11} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#91A4BD"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A1B33',
                  borderColor: 'rgba(75,180,220,0.4)',
                  borderRadius: '12px',
                  color: '#F4FAFF',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                }}
                formatter={(val: number) => [`${val}%`, 'Proficiency']}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', color: '#91A4BD' }}
              />
              <Bar dataKey="current" name="Your Ability" fill="#16E0FF" radius={[0, 4, 4, 0]}>
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.type === 'Current Skill' ? '#16E0FF' : '#F59E0B'}
                  />
                ))}
              </Bar>
              <Bar dataKey="required" name="Hiring Benchmark" fill="rgba(75,180,220,0.25)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="75%">
              <PolarGrid stroke="rgba(75,180,220,0.2)" />
              <PolarAngleAxis dataKey="subject" stroke="#91A4BD" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#657A95" fontSize={10} />
              <Radar
                name="Student Profile"
                dataKey="Student"
                stroke="#16E0FF"
                fill="#16E0FF"
                fillOpacity={0.4}
              />
              <Radar
                name="Industry Hiring Benchmark"
                dataKey="IndustryBenchmark"
                stroke="#35E29A"
                fill="#35E29A"
                fillOpacity={0.2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A1B33',
                  borderColor: 'rgba(75,180,220,0.4)',
                  borderRadius: '12px',
                  color: '#F4FAFF',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#91A4BD' }} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-[rgba(75,180,220,0.18)] text-[11px] text-[#91A4BD]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16E0FF]" />
            <span>Verified Skills</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Skill Gaps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[rgba(75,180,220,0.4)]" />
            <span>Target Benchmark</span>
          </div>
        </div>
        <span className="font-mono text-[#35E7FF]">Telemetry source: AI Resume Parser & Job Index</span>
      </div>
    </div>
  );
};
