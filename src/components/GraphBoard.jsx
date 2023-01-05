import axios from "axios";
import { useState, useEffect } from "react";
import BiaxialChart from "./BiaxialChart";
import convData from "./convert";
import StackedAreaChart from "./StackedAreaChart";
import LineChartz from "./LineChart";

const Dashboard = () => {
  const [wateringSystemMode, setWateringSystemMode] = useState("AUTOMATIC");
  const [currentMoisture, setCurrentMoisture] = useState(80.0);
  const [moisturePercentage, setMoisturePercentage] = useState(0.0);
  //graph section
  const [link, setLink] = useState(
    "https://api.thingspeak.com/channels/1985902/feeds.json?api_key=KKDDQDQZP8VLRQWR&"
  );
  const [timeRange, setTimeRange] = useState(20);
  const [soilData, setSoilData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [rainData, setRainData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [mode, setMode] = useState(1);
  const [lineData, setLineData] = useState(tempData);

  useEffect(() => {
    //fetches historical data from thingspeak for graphs
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

  useEffect(() => {
    console.log("refreshed");
    //Fetch the machine learning model ressults from thingspeak
    fetch("https://api.thingspeak.com/channels/1958878/fields/3.json?minutes")
      .then((response) => response.json())
      .then((info) => {
        const data = convData(info, -1);
        setWaterData(data);
      });
  }, []);

  return (
    <>
      {/* second card */}
      <div className="card bg-base-100 shadow-xl m-2">


        <div className="card-body">
          <h1 className="card-title justify-center">Useful graph information</h1>
          <div className="divider"></div>
          <div className="grid md:grid-cols-2">

            <div className="col-span-2 lg:col-span-1">
              <div class="flex ...">
                <div class="flex-auto w-24 h-64"><StackedAreaChart data={allData} /></div>
              </div>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <div class="flex ...">
                <div class="flex-auto w-24 h-64"><LineChartz data={tempData} /></div>
              </div>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <div class="flex ...">
                <div class="flex-auto w-24 h-64"><LineChartz data={waterData} /></div>
              </div>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <div class="flex ...">
                <div class="flex-auto w-24 h-64"><BiaxialChart data={allData} mode={mode} /></div>
              </div>
            </div>


          </div>



        </div>
      </div>
    </>
  );
};

export default Dashboard;
