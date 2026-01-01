import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Label,
} from 'recharts';


/* ================= COMMON STYLES ================= */

const axisStyle = {
  fill: '#111',
  fontWeight: 700,
  fontSize: 13,
};

const legendStyle = {
  fontWeight: 700,
  color: '#111',
};

/* ================= COMPOSED CHART ================= */

const boroughData = [
  { borough: 'Camden', total: 5200, violent: 1800, theft: 2600, arrests: 950 },
  { borough: 'Westminster', total: 7800, violent: 2400, theft: 3900, arrests: 1200 },
  { borough: 'Greenwich', total: 4300, violent: 1500, theft: 2000, arrests: 800 },
  { borough: 'Hackney', total: 6100, violent: 2100, theft: 2800, arrests: 1050 },
  { borough: 'Croydon', total: 6900, violent: 2600, theft: 3100, arrests: 1150 },
];

const LondonCrimeComposedChart = () => (
  <ResponsiveContainer width="100%" height={420}>
    <ComposedChart data={boroughData}>
      <CartesianGrid stroke="#ddd" />
      <XAxis dataKey="borough" tick={axisStyle} />
      <YAxis tick={axisStyle} />
      <Tooltip />
      <Legend wrapperStyle={legendStyle} />

      <Area dataKey="total" fill="#c7d2fe" stroke="#4338ca" />
      <Bar dataKey="violent" barSize={22} fill="#dc2626" />
      <Line dataKey="theft" stroke="#ea580c" strokeWidth={3} />
      <Scatter dataKey="arrests" fill="#111827" />
      
    </ComposedChart>
  </ResponsiveContainer>
);

/* ================= RADAR CHART ================= */

const crimeTypeData = [
  { type: 'Violent', value: 140 },
  { type: 'Theft', value: 150 },
  { type: 'Burglary', value: 100 },
  { type: 'Drugs', value: 90 },
  { type: 'Fraud', value: 120 },
  { type: 'Public Order', value: 110 },
];

const LondonCrimeRadarChart = () => (
  <ResponsiveContainer width="100%" height={420}>
    <RadarChart data={crimeTypeData}>
      <PolarGrid />
      <PolarAngleAxis dataKey="type" tick={axisStyle} />
      <PolarRadiusAxis tick={axisStyle} />
      <Radar dataKey="value" fill="#4f46e5" fillOpacity={0.6} />
     
    </RadarChart>
  </ResponsiveContainer>
);

/* ================= HALF PIE + NEEDLE ================= */

const severityData = [
  { name: 'Low', value: 40, fill: '#22c55e' },
  { name: 'Medium', value: 35, fill: '#eab308' },
  { name: 'High', value: 25, fill: '#ef4444' },
];

const NEEDLE_COLOR = '#111';

const Needle = ({ cx, cy, midAngle, innerRadius, outerRadius }) => {
  const len = innerRadius + (outerRadius - innerRadius) / 2;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={NEEDLE_COLOR} />
      <path
        d={`M${cx},${cy}l${len},0`}
        stroke={NEEDLE_COLOR}
        strokeWidth={3}
        style={{
          transform: `rotate(-${midAngle}deg)`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
    </g>
  );
};

const HalfPie = (props) => (
  <Pie
    {...props}
    data={severityData}
    dataKey="value"
    startAngle={180}
    endAngle={0}
    cx={100}
    cy={100}
    innerRadius={55}
    outerRadius={95}
    stroke="none"
  />
);

const CrimeSeverityGauge = () => (
  <PieChart width={220} height={130} style={{ margin: '0 auto' }}>
    <HalfPie />
    <HalfPie activeShape={Needle} />
    <Tooltip />
    
  </PieChart>
);

/* ================= DONUT PIE ================= */

const crimeShareData = [
  { name: 'Violent Crime', value: 38, fill: '#dc2626' },
  { name: 'Theft', value: 32, fill: '#ea580c' },
  { name: 'Burglary', value: 18, fill: '#2563eb' },
  { name: 'Others', value: 12, fill: '#16a34a' },
];

const CrimeSharePie = () => (
  <ResponsiveContainer width="100%" height={360}>
    <PieChart>
      <Pie
        data={crimeShareData}
        dataKey="value"
        innerRadius="55%"
        outerRadius="80%"
        label
      />
      <Label
        value="Crime Distribution"
        position="center"
        fill="#111"
        fontSize={14}
        fontWeight={700}
      />
      <Legend wrapperStyle={legendStyle} />
      
    </PieChart>
  </ResponsiveContainer>
);

/* ================= MAIN ANALYSE PAGE ================= */

const Analyse = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontWeight: 800, color: '#111' }}>
        London Crime Analytics Dashboard
      </h2>

      <LondonCrimeComposedChart />
      <LondonCrimeRadarChart />

      <div style={{ display: 'flex', gap: 30, marginTop: 40 }}>
        <CrimeSeverityGauge />
        <CrimeSharePie />
      </div>
    </div>
  );
};

export default Analyse;
