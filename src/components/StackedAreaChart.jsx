
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const StackedLineChart = ({ data }) => {

  const info = data.data;
  // console.log("Stacked");
  // console.table(data);

  return (

    <ResponsiveContainer width="99%" aspect={1.5}>
      <LineChart
        width={500}
        height={300}
        data={info}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis name="date" dataKey="x" />
        <YAxis name={data.id} label={{ value: data.id, angle: -90 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="soilData" stroke="red" dot={false} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="tempData" stroke="blue" dot={false} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="rainData" stroke="green" dot={false} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>

  );

}

export default StackedLineChart;


