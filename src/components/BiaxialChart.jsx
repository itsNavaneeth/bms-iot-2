import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BiaxialChart =({data, mode}) => {
    const info = data.data;
  
    return (
       <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={info}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          
          {(mode!=1&&mode!=0) && <Line yAxisId="left" type="monotone" dataKey="soilData" stroke="red" dot={false} activeDot={{ r: 8 }} />}
          {(mode!=2&&mode!=0) &&  <Line yAxisId="right" type="monotone" dataKey="rainData" stroke="green" dot={false} />}
          {(mode!=3&&mode!=0) && <Line yAxisId="left" type="monotone" dataKey="tempData" stroke="blue" dot={false} activeDot={{ r: 8 }} />}
          
          
          
        </LineChart>
      </ResponsiveContainer>
    );
  
}

export default BiaxialChart;


