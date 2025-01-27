import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveBar } from '@nivo/bar';
import { Box, Typography, useTheme } from '@mui/material';
import { useAppContext } from '../../context/AppContext';
import { processChartData } from '../../utils/dataProcessing';

function StackedBarChart() {
  const navigate = useNavigate();
  const { data, filters } = useAppContext();
  const theme = useTheme();
  
  const chartData = processChartData(data || [], filters);

  const handleBarClick = useCallback((bar) => {
    // Navigate with both model and sentiment information
    navigate(`/feedback/${bar.indexValue}`, {
      state: { sentiment: bar.id }
    });
  }, [navigate]);


  // Define the keys in the order you want them to appear (bottom to top)
  const keys = [
    'Very Negative',
    'Negative',
    'Neutral',
    'Positive',
    'Very Positive'
  ];

  // Define custom colors for each sentiment category
  const customColors = {
    'Very Positive': '#1B5E20',  // Dark green
    'Positive': '#4CAF50',       // Light green
    'Neutral': '#9E9E9E',        // Grey
    'Negative': '#FF5722',       // Orange-red
    'Very Negative': '#D32F2F'   // Dark red
  };

  if (!chartData?.length) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h6" color="text.secondary">
          No data available for the selected filters
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 525, width: '100%', p: 2 }}>
      <ResponsiveBar
        data={chartData}
        keys={keys}
        indexBy="model"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={({ id }) => customColors[id]}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Models',
          legendPosition: 'middle',
          legendOffset: 40
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Count',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        enableGridY={true}
        gridYValues={5}
        enableLabel={true}
        label={d => d.value || ''}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 2]]
        }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 0.75
                }
              }
            ]
          }
        ]}
        role="application"
        ariaLabel="Sentiment Analysis Bar Chart"
        barAriaLabel={e => `${e.id}: ${e.formattedValue} in model: ${e.indexValue}`}
        tooltip={({ id, value, color }) => (
          <div
            style={{
              padding: '12px',
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              color: '#333',
              fontSize: '14px',
              fontFamily: theme.typography.fontFamily
            }}
          >
            <div style={{ 
              color, 
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              {id}
            </div>
            <div>
              Count: {value}
            </div>
          </div>
        )}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: theme.palette.text.primary,
                fontSize: 12
              }
            },
            legend: {
              text: {
                fill: theme.palette.text.primary,
                fontSize: 13
              }
            }
          },
          grid: {
            line: {
              stroke: theme.palette.divider,
              strokeWidth: 1
            }
          },
          legends: {
            text: {
              fill: theme.palette.text.primary,
              fontSize: 12
            }
          }
        }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        onClick={handleBarClick}
      />
    </Box>
  );
}

export default StackedBarChart;