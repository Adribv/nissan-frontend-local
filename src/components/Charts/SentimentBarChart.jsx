import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const colors = ['#8b0000', '#d21401', '#545454', '#299617', '#234f1e'];
const categories = ['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'];

const SentimentBarChart = ({ data, onBarClick }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Calculate sentiment percentages
    const sentimentCounts = {};
    categories.forEach(cat => {
      sentimentCounts[cat] = data.filter(d => d.fact === cat).length;
    });

    const total = Object.values(sentimentCounts).reduce((a, b) => a + b, 0);
    const percentages = {};
    Object.entries(sentimentCounts).forEach(([cat, count]) => {
      percentages[cat] = (count / total * 100).toFixed(2);
    });

    // Set dimensions
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(categories)
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 100]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'middle');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(10).tickFormat(d => d + '%'));

    // Add bars
    categories.forEach((category, i) => {
      svg.append('rect')
        .attr('x', x(category))
        .attr('y', y(percentages[category]))
        .attr('width', x.bandwidth())
        .attr('height', height - y(percentages[category]))
        .attr('fill', colors[i])
        .style('cursor', 'pointer')
        .on('click', () => {
          if (onBarClick) onBarClick(category);
        });

      // Add percentage labels
      svg.append('text')
        .attr('x', x(category) + x.bandwidth() / 2)
        .attr('y', y(percentages[category]) - 5)
        .attr('text-anchor', 'middle')
        .text(`${percentages[category]}%`);
    });

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '22px')
      .style('font-weight', 'bold')
      .text('Sentiment Analysis');

  }, [data, onBarClick]);

  return (
    <div style={{ overflowX: 'auto', textAlign: 'center' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default SentimentBarChart;