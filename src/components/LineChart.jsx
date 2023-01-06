import React from "react";
import {
  LineChart,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LineChartz = ({ data }) => {
  const info = data.data;

  return (
    <ResponsiveContainer width="99%" aspect={1.5}>
      <LineChart
        width={500}
        height={300}
        data={info}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis name="date" dataKey="x" />
        <YAxis name={data.id} label={{ value: data.id, angle: -90 }} />
        <Tooltip />
        <Legend />
        {/* <Line type="step" dataKey="y" stroke="#8884d8" dot={false} activeDot={{ r: 4 }} /> */}
        <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth="5" dot={false} activeDot={{ fill: "#2e4355", stroke: "#8884d8", strokeWidth: 5, r: 10 }} />
      </LineChart>
    </ResponsiveContainer >


  );
};

export default LineChartz;
