import React, { PureComponent } from 'react';
import { Radar, RadarChart as RChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const data = [
  {
    subject: 'Math',
    A: 120,
    B: 110,
    fullMark: 150
  },
  {
    subject: 'Chinese',
    A: 98,
    B: 130,
    fullMark: 150
  },
  {
    subject: 'English',
    A: 86,
    B: 130,
    fullMark: 150
  },
  {
    subject: 'Geography',
    A: 99,
    B: 100,
    fullMark: 150
  },
  {
    subject: 'Physics',
    A: 85,
    B: 90,
    fullMark: 150
  },
  {
    subject: 'History',
    A: 65,
    B: 85,
    fullMark: 150
  }
];

class RadarChart extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/6ebcxbx4/';

  render() {
    return (
      <RChart outerRadius={100} width={300} height={300} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis />
        <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RChart>
    );
  }
}

export default RadarChart;
