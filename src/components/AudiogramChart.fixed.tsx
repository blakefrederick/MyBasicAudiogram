'use client';

import { useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HearingTestSession, Ear, FREQUENCIES } from '@/lib/types';
import { gainToDB } from '@/lib/tonePlayer';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AudiogramChartProps {
  sessions: HearingTestSession[];
  selectedSessionIds: string[];
  showLeftEar?: boolean;
  showRightEar?: boolean;
}

type DatasetType = {
  label: string;
  data: (number | null)[];
  borderColor: string;
  backgroundColor: string;
  borderWidth: number;
  pointRadius: number;
  pointHoverRadius: number;
  borderDash?: number[];
};

export default function AudiogramChart({ 
  sessions, 
  selectedSessionIds,
  showLeftEar = true,
  showRightEar = true
}: AudiogramChartProps) {
  const chartRef = useRef(null);
  
  // Filter to only selected sessions
  const selectedSessions = sessions.filter(session => 
    selectedSessionIds.includes(session.id)
  );
  
  // Format labels for x-axis
  const labels = FREQUENCIES.map(freq => 
    freq >= 1000 ? `${freq / 1000}k` : freq.toString()
  );
  
  // Prepare dataset for each session and ear
  const datasets: DatasetType[] = [];
  
  selectedSessions.forEach(session => {
    // Add dataset for left ear if requested
    if (showLeftEar) {
      const leftEarData = FREQUENCIES.map(freq => {
        const result = session.data.find(r => 
          r.frequency === freq && r.ear === 'left'
        );
        // Return gainLevel or null if not found
        return result ? gainToDB(result.gainLevel) : null;
      });
      
      datasets.push({
        label: `${new Date(session.timestamp).toLocaleDateString()} (Left)`,
        data: leftEarData,
        borderColor: getSessionColor(session.id, 'left', selectedSessionIds),
        backgroundColor: getSessionColor(session.id, 'left', selectedSessionIds, 0.2),
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      });
    }
    
    // Add dataset for right ear if requested
    if (showRightEar) {
      const rightEarData = FREQUENCIES.map(freq => {
        const result = session.data.find(r => 
          r.frequency === freq && r.ear === 'right'
        );
        // Return gainLevel or null if not found
        return result ? gainToDB(result.gainLevel) : null;
      });
      
      datasets.push({
        label: `${new Date(session.timestamp).toLocaleDateString()} (Right)`,
        data: rightEarData,
        borderColor: getSessionColor(session.id, 'right', selectedSessionIds),
        backgroundColor: getSessionColor(session.id, 'right', selectedSessionIds, 0.2),
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderDash: [5, 5], // Dashed line for right ear
      });
    }
  });
  
  const data = {
    labels,
    datasets,
  };
  
  const options = {
    responsive: true,
    aspectRatio: 1.5,
    scales: {
      y: {
        reverse: true, // Higher gain is plotted lower (like a clinical audiogram)
        title: {
          display: true,
          text: 'Gain Level (dB)',
        },
        min: -60,
        max: 0,
      },
      x: {
        title: {
          display: true,
          text: 'Frequency (Hz)',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function(tooltipItems: any) {
            const item = tooltipItems[0];
            const frequency = FREQUENCIES[item.dataIndex];
            return `Frequency: ${frequency} Hz`;
          },
          label: function(context: any) {
            const value = context.raw;
            return value !== null 
              ? `${context.dataset.label}: ${Number(value).toFixed(1)} dB` 
              : `${context.dataset.label}: Not tested`;
          },
        },
      },
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Hearing Test Audiogram',
        font: {
          size: 16,
        },
      },
    },
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}

// Generate colors for the chart based on session ID and ear
function getSessionColor(
  sessionId: string, 
  ear: Ear, 
  allSessionIds: string[],
  alpha = 1
): string {
  // Base colors for different sessions
  const baseColors = [
    'rgb(54, 162, 235)', // Blue
    'rgb(255, 99, 132)', // Red
    'rgb(75, 192, 192)', // Green
    'rgb(255, 159, 64)', // Orange
    'rgb(153, 102, 255)', // Purple
  ];
  
  // Get index of session in the selected sessions array
  const sessionIndex = allSessionIds.indexOf(sessionId) % baseColors.length;
  
  // Use different shades for left and right ears
  const color = baseColors[sessionIndex];
  
  // Convert to rgba if alpha is not 1
  if (alpha !== 1) {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }
  
  return color;
}
