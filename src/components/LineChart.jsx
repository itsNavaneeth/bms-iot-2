import React from "react";
import { useState, useEffect } from "react";
import {
  LineChart,
  AreaChart,
  BarChart,
  Bar,
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
  const [chartType, setChartType] = useState('line');
  const info = data.data;

  const handleChange = (event) => {
    setChartType(event.target.value);
  }

  let chart;
  if (chartType === 'line') {
    chart = (
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
        <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth="5" dot={false} activeDot={{ fill: "#2e4355", stroke: "#8884d8", strokeWidth: 5, r: 10 }} />
      </LineChart>
    );
  } else if (chartType === 'area') {
    chart = (
      <AreaChart
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
        <Area type="monotone" dataKey="y" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    );
  }

  else if (chartType === 'bar') {
    chart = (
      <BarChart
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
        <Bar dataKey="y" fill="#10ff02" />

      </BarChart>
    );
  }
  

  return (
    <div>
      <div className="mb-4">
        <label className="block font-bold text-gray-700 text-sm mb-2">
          Chart type:
        </label>
        <div className="relative rounded-md shadow-sm">
        <select
          className="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          value={chartType}
          onChange={handleChange}
        >
          <option value="line">Line</option>
          <option value="area">Area</option>
          <option value="bar">Bar</option>
        </select>

        </div>
      </div>
      <ResponsiveContainer width="99%" aspect={1.5}>
        {chart}
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartz;

