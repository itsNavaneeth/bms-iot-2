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
    <ResponsiveContainer>
      <LineChart
        data={info}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis name="date" dataKey="x" />
        <YAxis name={data.id} label={{ value: data.id, angle: -90 }} />
        <Tooltip />
        <Legend />
        <Line type="step" dataKey="y" stroke="#8884d8" dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>


  );
};

export default LineChartz;
