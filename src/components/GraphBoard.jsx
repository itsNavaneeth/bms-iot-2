import axios from "axios";
import { useState, useEffect } from "react";
import BiaxialChart from "./BiaxialChart";
import convData from "./convert";
import StackedAreaChart from "./StackedAreaChart";
import LineChartz from "./LineChart";

const GraphBoard = () => {
  //graph section
  const [link, setLink] = useState(
    "https://api.thingspeak.com/channels/1985902/feeds.json?api_key=KKDDQDQZP8VLRQWR&"
  );
  const [timeRange, setTimeRange] = useState(30);
  const [soilData, setSoilData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [rainData, setRainData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [mode, setMode] = useState(0);
  const [lineData, setLineData] = useState(tempData);
  const [soilcheckox, setSoilCheckbox] = useState(false);
  const [tempcheckox, setTempCheckbox] = useState(false);
  const [raincheckox, setRainCheckbox] = useState(false);
  let value;

  //fetches historical data from thingspeak for graphs
  useEffect(() => {
    fetch(link + "results=" + timeRange)
      .then((response) => response.json())
      .then((info) => {
        const data = convData(info);
        setSoilData(data[0]);
        setTempData(data[1]);
        setRainData(data[2]);
        setAllData(data[3]);
      });
  }, [timeRange]);

  //Fetch the machine learning model ressults from thingspeak
  useEffect(() => {
    // console.log("refreshed");
    fetch("https://api.thingspeak.com/channels/1958878/fields/3.json?minutes")
      .then((response) => response.json())
      .then((info) => {
        const data = convData(info, -1);
        setWaterData(data);
      });

    const interval = setInterval(() => {
      //   console.log("refreshed");
      //Fetch the machine learning model ressults from thingspeak
      fetch("https://api.thingspeak.com/channels/1958878/fields/3.json?minutes")
        .then((response) => response.json())
        .then((info) => {
          const data = convData(info, -1);
          setWaterData(data);
        });
    }, 15000);

    return () => clearInterval(interval);
  }, [waterData]);

  //choose which graph to display
  useEffect(() => {
    if (!soilcheckox && !raincheckox && !tempcheckox) {
      setMode(0);
      console.log("Data not selected");
    } else if (soilcheckox && !raincheckox && !tempcheckox) {
      setMode(4);
      setLineData(soilData);
    } else if (!soilcheckox && raincheckox && !tempcheckox) {
      setMode(4);
      setLineData(rainData);
    } else if (!soilcheckox && !raincheckox && tempcheckox) {
      setMode(4);
      setLineData(tempData);
    } else if (!soilcheckox && raincheckox && tempcheckox) {
      setMode(1);
      setLineData(allData);
    } else if (soilcheckox && !raincheckox && tempcheckox) {
      setMode(2);
      setLineData(allData);
    } else if (soilcheckox && raincheckox && !tempcheckox) {
      setMode(3);
      setLineData(allData);
    } else if (soilcheckox && raincheckox && tempcheckox) {
      setMode(5);
      setLineData(allData);
    }
  }, [soilcheckox, raincheckox, tempcheckox,allData]);


  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    console.log(name + " " + checked);
    if (name == "SoilMoisture") {
      setSoilCheckbox(!soilcheckox);
    } else if (name == "Temperature") {
      setTempCheckbox(!tempcheckox);
    } else if (name == "Rainfall") {
      setRainCheckbox(!raincheckox);
    }
  };

  //custom timerange
  useEffect(() => {
    //fetches historical data from thingspeak for graphs
    console.log(timeRange);
    fetch(link +"results="+ timeRange)
      .then((response) => response.json())
      .then((info) => {
        const data = convData(info);
        setSoilData(data[0]);
        setTempData(data[1]);
        setRainData(data[2]);
        setAllData(data[3]);
      });
  }, [timeRange]);

  const handleTimeRangeChange = (event) => {
    let value = event.target.value;
   setTimeRange(value);

  };

  // useEffect(() => {
  //   console.log("refreshed");
  //   //Fetch the machine learning model ressults from thingspeak
  //   fetch("https://api.thingspeak.com/channels/1958878/fields/3.json?minutes")
  //     .then((response) => response.json())
  //     .then((info) => {
  //       const data = convData(info, -1);
  //       setWaterData(data);
  //     });
  // }, [refresh]);

  return (
    <>
      <h1 class="font-bold text-3xl mt-5 mx-3 justify-center items-center text-center">
        Graph Information
      </h1>
      <p className="mt-5 mx-3 justify-center items-center text-center">
        Select the data to see its graph
      </p>
      <div className="mt-4 mx-1 grid md:grid-cols-10">
        {/* first card */}
        <div className="card col-span-10 lg:col-span-7 m-2">
          <div className="p-2">
            {/* <h2 className="card-title justify-center items-center text-center">Graph will come here</h2> */}

            <div class="flex ...">
              <div class="flex-auto w-32 h-96">
                {mode == 5 && <StackedAreaChart data={allData} />}
                {mode == 4 && <LineChartz data={lineData} />}
                {(mode == 1 || mode == 2 || mode == 3) && (
                  <BiaxialChart data={lineData} mode={mode} />
                )}
              </div>
            </div>

            {/* <div class="flex ...">
                            <div class="flex-auto w-24 h-96"><LineChartz data={tempData} /></div>
                        </div> */}

            {/* <StackedAreaChart data={allData} /> */}
          </div>
        </div>

        {/* second card */}
        <div className="card bg-base-100 border-2 border-black col-span-10 lg:col-span-3 m-2">
          <div className="card-body">
            <h1 className="card-title justify-center">Graph Information</h1>

            <div className="divider"></div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  name="SoilMoisture"
                  onChange={handleCheckboxChange}
                  unchecked
                  className="checkbox"
                />
                <span className="label-text ml-2">Soil Moisture: </span>
              </label>
              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  name="Temperature"
                  onChange={handleCheckboxChange}
                  unchecked
                  className="checkbox"
                />
                <span className="label-text ml-2">Temperature: </span>
              </label>
              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  name="Rainfall"
                  onChange={handleCheckboxChange}
                  unchecked
                  className="checkbox"
                />
                <span className="label-text ml-2">Rainfall: </span>
              </label>
            </div>

            <div className="divider"></div>

            <select value={value} onChange={handleTimeRangeChange} className="select select-bordered w-full max-w-xs">
              <option disabled selected>
                Select a time range
              </option>
              <option value="7">Last Week</option>
              <option selected value="30">Last Month</option>
              <option value="90">Last 3 Months</option>
              <option value="180">Last 6 Months</option>
              <option value="365">Last Year</option>
              {/* <option>Custom Time Range</option> */}
            </select>



            {/* table */}
            {/* <div className="overflow-x-auto">
              <table className="table w-full">
                <!-- head -->
                <thead>
                  <tr>
                    <th>name2</th>
                    <th>Job</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- row 1 -->
                  <tr>
                    <td>Cy Ganderton</td>
                    <td>idk</td>
                  </tr>
                  <!-- row 2 -->
                  <tr>
                    <td>Hart Hagerty</td>
                    <td>idk</td>
                  </tr>
                  <!-- row 3 -->
                  <tr>
                    <td>Brice Swyre</td>
                    <td>idk</td>
                  </tr>
                </tbody>
              </table>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default GraphBoard;
