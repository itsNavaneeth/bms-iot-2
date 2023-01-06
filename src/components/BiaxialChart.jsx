import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BiaxialChart = ({ data, mode }) => {
  const info = data.data;
  return (
    <ResponsiveContainer width="99%">
      <LineChart
        data={info}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />

        {(mode != 1 && mode != 0) && <Line yAxisId="left" type="monotone" dataKey="soilData" name="Soil Moisture" stroke="red" dot={false} activeDot={{ r: 8 }} />}
        {(mode != 2 && mode != 0) && <Line yAxisId="right" type="monotone" dataKey="rainData" name="Rainfall" stroke="green" dot={false} />}
        {(mode != 3 && mode != 0) && <Line yAxisId="left" type="monotone" dataKey="tempData" name="Temperature" stroke="blue" dot={false} activeDot={{ r: 8 }} />}


      </LineChart>
    </ResponsiveContainer>
  );

}

export default BiaxialChart;


