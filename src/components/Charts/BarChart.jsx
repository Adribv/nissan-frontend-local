import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const featureColors = {
  'All-Wheel Drive': '#000000',
  'Steering': '#004aad',
  'Interior Quality': '#ff914d',
  'Engine': '#5ce1e6',
  'Brake': '#ff66c4',
  'Seats': '#98FB98',
  'Transmission': '#800080',
  'Electric Motor': '#006400'
};

const BarChart = ({ data, onBarClick }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Group data by Feature
    const groupedData = d3.group(data, d => d.Feature);
    const featureCounts = Array.from(groupedData, ([key, value]) => ({
      Feature: key,
      count: value.length
    }));

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 1500 - margin.left - margin.right;
    const height = 650 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(featureCounts.map(d => d.Feature))
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(featureCounts, d => d.count)]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('dy', '1em');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add bars
    svg.selectAll('rect')
      .data(featureCounts)
      .enter()
      .append('rect')
      .attr('x', d => x(d.Feature))
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.count))
      .attr('fill', d => featureColors[d.Feature] || `#${Math.floor(Math.random()*16777215).toString(16)}`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        if (onBarClick) onBarClick(d.Feature);
      });

    // Add labels
    svg.selectAll('.label')
      .data(featureCounts)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.Feature) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.count);

  }, [data, onBarClick]);

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;