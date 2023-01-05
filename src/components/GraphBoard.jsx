import axios from "axios";
import { useState, useEffect } from "react";
import BiaxialChart from "./BiaxialChart";
import convData from "./convert";

const Dashboard = () => {
  const [wateringSystemMode, setWateringSystemMode] = useState("AUTOMATIC");
  const [wateringStatus, setWateringStatus] = useState("OFF");
  const [currentMoisture, setCurrentMoisture] = useState(80.0);
  const [moisturePercentage, setMoisturePercentage] = useState(0.0);
  const [btnState, setBtnState] = useState("");
  const [textState, setTextState] = useState("text-error");
  const [irrigationDuration, setIrrigationDuration] = useState(0.0);
  const [irrigationQuantity, setIrrigationQuantity] = useState(0.0);
  const [moisturePercentageColor, setMoisturePercentageColor] =
    useState("bg-neutral");
  const [temperature, setTemperature] = useState(0.0);
  const [humidity, setHumidity] = useState(0.0);

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
    console.table(allData);
  }, [timeRange]);

  // turn on the valves
  const turnOn = () => {
    const options = {
      method: "POST",
      url: "https://industrial.api.ubidots.com/api/v1.6/variables/639179fb72ec12000c900fb2/values/",
      headers: {
        "content-type": "application/json",
        "X-Auth-Token": "BBFF-LtAIEbHEpPlRavdXFOC9Nu8SRnTN9y",
      },
      data: { value: 0 },
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        setWateringStatus("ON");
        setTextState("text-success");
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  // turn off the valves
  const turnOff = () => {
    const options = {
      method: "POST",
      url: "https://industrial.api.ubidots.com/api/v1.6/variables/639179fb72ec12000c900fb2/values/",
      headers: {
        "content-type": "application/json",
        "X-Auth-Token": "BBFF-LtAIEbHEpPlRavdXFOC9Nu8SRnTN9y",
      },
      data: { value: 1 },
    };

    // console.log("turn off");
    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        setWateringStatus("OFF");
        setTextState("text-error");
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  // toggle between manual and automatic mode
  useEffect(() => {
    if (wateringSystemMode === "AUTOMATIC") {
      setBtnState("disabled");
      const interval = setInterval(() => {
        const options = {
          method: "GET",
          url: "https://api.thingspeak.com/channels/1958878/fields/3.json",
          params: { results: "1" },
        };

        axios
          .request(options)
          .then(function (response) {
            // console.log(response.data);
            // console.log(response.data.feeds[0].field3);
            setCurrentMoisture(response.data.feeds[0].field3);
          })
          .catch(function (error) {
            console.error(error);
          });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setBtnState("");
    }
  }, [wateringSystemMode]);

  // converting moisture to percentage
  useEffect(() => {
    let percentage = 0.0;
    let empty = 0;
    let full = 100;
    let min_moisture = 800;
    let max_moisture = 2800;

    percentage =
      full -
      ((full - empty) * (currentMoisture - min_moisture)) /
        (max_moisture - min_moisture) +
      empty;
    // percentage = 80;
    if (percentage > 100) {
      percentage = 100;
    }
    if (percentage < 0) {
      percentage = 0;
    }
    percentage = percentage.toFixed(2);
    setMoisturePercentage(percentage);

    if (percentage < 30) {
      setMoisturePercentageColor("error");
    } else if (percentage < 60) {
      setMoisturePercentageColor("warning");
    } else {
      setMoisturePercentageColor("success");
    }
  }, [currentMoisture]);

  // calculate irrigation duration and irrigation quantity
  useEffect(() => {
    let duration = 0.0;
    let drip_ltr = 40;
    let ltr = 0.0;
    duration = (70 - moisturePercentage) * 3;
    if (duration < 0) {
      duration = 0;
    }
    duration = duration.toFixed(0);
    setIrrigationDuration(duration);

    ltr = (duration * 20) / 7.5;
    ltr = ltr.toFixed(2);
    setIrrigationQuantity(ltr);
  }, [moisturePercentage]);

  // trigger when to turn on and turn off based on threshold
  useEffect(() => {
    if (currentMoisture > 1800) {
      turnOn();
    } else {
      turnOff();
    }
  }, [currentMoisture]);

  return (
    <>
      <h1 class="font-bold text-3xl mt-5 mx-3 justify-center items-center text-center">
        Some Useful Graphs 
      </h1>
      <div className="mt-4 mx-5 grid md:grid-cols-5">
       hello
      </div>
    </>
  );
};

export default Dashboard;
