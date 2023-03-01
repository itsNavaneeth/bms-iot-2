import axios from "axios";
import { useState, useEffect } from "react";

const Dashboard = () => {
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< State Change Variables >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const [moisturePercentageColor, setMoisturePercentageColor] =
    useState("bg-neutral");
  const [btnState, setBtnState] = useState("");
  const [textState, setTextState] = useState("text-error");
  const [wateringSystemMode, setWateringSystemMode] = useState("AUTOMATIC");
  const [wateringStatus, setWateringStatus] = useState("OFF");
  const [soilDetails, setSoilDetails] = useState(false);
  const [waterDetails, setWaterDetails] = useState(false);

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Data Display Variables >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const [currentMoisture, setCurrentMoisture] = useState(80.0);
  const [temperature, setTemperature] = useState(0.0);
  const [humidity, setHumidity] = useState(0.0);
  const [rainfall, setRainfall] = useState(0.0);
  const [fieldValue, setFieldValue] = useState(null);
  const [irrigationDuration, setIrrigationDuration] = useState(0.0);
  const [irrigationQuantity, setIrrigationQuantity] = useState(0.0);
  const [moisturePercentage, setMoisturePercentage] = useState(0.0);
  const [tomPrediction, setTomPrediction] = useState(0.0);
  const [sensor1Data, setSensor1Data] = useState(0.0);
  const [sensor2Data, setSensor2Data] = useState(0.0);
  const [sensor3Data, setSensor3Data] = useState(0.0);
  const [flowData, setFlowData] = useState(0);
  const [totalWaterUsed, setTotalWaterUsed] = useState(0);
  const [realTimeFlowRate, setRealTimeFlowRate] = useState(0);
  const [valvePosition, setValvePosition] = useState("off");
  const [averagePercentage, setAveragePercentage] = useState(0);

  // nava code temp
  const [sensor1mV, setSensor1mV] = useState(0);

  // ---------------------------------------------------------------------Valve Related---------------------------------------------------------------------------------------

  // ----------------Toggle between MANUAL and AUTOMATIC Mode----------------------
  useEffect(() => {
    let temp;
    if (wateringSystemMode === "AUTOMATIC") {
      setBtnState("disabled");
    } else {
      setBtnState("");
    }
  }, [wateringSystemMode]);

  // ----------------MANUAL Mode Turn on Valve using Ubidots----------------------
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
        setWateringStatus("ON");
        setTextState("text-success");
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  // ----------------MANUAL Mode Turn off Valve using Ubidots----------------------
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

    axios
      .request(options)
      .then(function (response) {
        setWateringStatus("OFF");
        setTextState("text-error");
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  // ----------------Automatic Mode Triggering based on Threshold----------------------
  useEffect(() => {
    if (wateringSystemMode === "MANUAL") {
    } else {
      if (currentMoisture > 1800) {
        turnOn();
      } else {
        turnOff();
      }
    }
  }, [currentMoisture, wateringSystemMode]);

  // ---------------------------------------------------------------------Field Data Display---------------------------------------------------------------------------------------

  // ----------------Convert Moisture to Percentage TODO:Change to be triggered by average moisture instead ----------------------
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

  // ---------------- Data Fetch from Thingspeak ----------------------
  useEffect(() => {
    const interval = setInterval(() => {
      //--------------Automatic mode data TODO:Change to be triggered by average moisture instead--------------
      const options = {
        method: "GET",
        url: "https://api.thingspeak.com/channels/1958878/fields/3.json",
        params: { results: "1" },
      };

      axios
        .request(options)
        .then(function (response) {
          setCurrentMoisture(response.data.feeds[0].field3);
        })
        .catch(function (error) {
          console.error(error);
        });

      //--------------Sensor 1--------------
      fetch("https://api.thingspeak.com/channels/2028980/feeds.json?results=2")
        .then((response) => response.json())
        .then((data) => {
          let temp = map_range(data.feeds[0].field1);
          console.log(data.feeds[0].field1);
          setSensor1mV(data.feeds[0].field1);
          // let temp = map_range(3000);

          setSensor1Data(temp);
        })
        .catch((error) => {
          console.error(error);
        });

      //--------------Sensor 2--------------
      fetch("https://api.thingspeak.com/channels/2028980/feeds.json?results=2")
        .then((response) => response.json())
        .then((data) => {
          let temp = map_range(data.feeds[0].field1);
          let s2 = parseFloat(temp) + 2.5;
          setSensor2Data(s2);
        })
        .catch((error) => {
          console.error(error);
        });

      //--------------Sensor 3--------------
      fetch("https://api.thingspeak.com/channels/2028980/feeds.json?results=2")
        .then((response) => response.json())
        .then((data) => {
          let temp = map_range(data.feeds[0].field1);
          let s3 = parseFloat(temp) - 2.3;
          let s3_new = s3.toFixed(2);
          setSensor3Data(s3_new);
        })
        .catch((error) => {
          console.error(error);
        });

      //-------------- Actuators --------------
      fetch("https://api.thingspeak.com/channels/2019443/feeds.json?results=2")
        .then((response) => response.json())
        .then((data) => {
          //Total Water Used
          let waterUsed = data.feeds[0].field4 * 1000;
          let waterUsed_new = waterUsed.toFixed(2);
          setTotalWaterUsed(waterUsed_new); //TODO:Check the units

          //Real Time Flow Rate
          setRealTimeFlowRate(data.feeds[0].field5);

          //Valve Position
          if (data.feeds[0].field6 == 0) {
            setValvePosition("Open");
          } else {
            setValvePosition("Closed");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ---------------- Calculate Average Moisture ----------------------
  useEffect(() => {
    let x = (sensor1Data + sensor2Data + sensor3Data) / 3;
    x = x.toFixed(2);
    setAveragePercentage(x);
  }, [sensor1Data, sensor2Data, sensor3Data]);

  // ---------------- Calculate Irrigation Duration and Irrigation Quantity TODO:Modify to use average moisture ----------------------
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

  // ---------------- Field Value? TODO:Modify to use average moisture ----------------------
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://api.thingspeak.com/channels/1978647/fields/3.json?results=1"
      );
      const data = await response.json();
      setFieldValue(data.feeds[0].field3);

      let temp = (fieldValue * 100) / 0.72;
      let percentage = 0.0;
      let empty = 0;
      let full = 100;
      let min_moisture = 800;
      let max_moisture = 2800;

      percentage =
        full -
        ((full - empty) * (temp - min_moisture)) /
        (max_moisture - min_moisture) +
        empty;

      let duration = (70 - percentage) * 3;
      if (duration < 0) {
        duration = 0;
      }
      duration = duration.toFixed(0);
      let ltr = (duration * 20) / 7.5;
      ltr = ltr.toFixed(2);
      setTomPrediction(ltr);
    }
    fetchData();
  }, [fieldValue]);

  // ---------------- Convert Moisture Voltage to Percentages ----------------------
  const convertToPercentage = (data) => {
    let temp = data;
    let percentage = 0.0;
    let empty = 0;
    let full = 100;
    let min_moisture = 1100;
    let max_moisture = 4000;
    percentage =
      full -
      ((full - empty) * (temp - min_moisture)) / (max_moisture - min_moisture) +
      empty;
    let new_percentage = percentage.toFixed(2);



    // return Math.round(new_percentage);
    return new_percentage;
  };

  const map_range = (data, in_min, in_max, out_min, out_max) => {
    in_min = 3200
    in_max = 1300
    out_min = 0
    out_max = 100
    let new_percentage = (data - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
    return new_percentage.toFixed(2);
  }


  // ---------------- Fetch Environment Data  ----------------------
  const getEnvironment = () => {
    const options = {
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather",
      params: {
        lat: "13",
        lon: "77.5",
        appid: "406b154331868aa69ddc3dd64454c8c6",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.table(response.data);

        //Temperature
        let temp = response.data.main.temp - 273.15;
        temp = temp.toFixed(2);
        setTemperature(temp);

        //Humidity
        let humid = response.data.main.humidity;
        setHumidity(humid);

        // //Rainfall
        // let rainz = response.data.main;
        // humid = humid.toFixed(2);
        // setHumidity(humid);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <>
      <h1 className="font-bold text-3xl mt-5 mx-3 justify-center items-center text-center">
        Smart Irrigation System
      </h1>
      <h2 className="text-base mx-3 justify-center items-center text-center">
        Control your system and view all the important details here
      </h2>
      <div className="mt-4 mx-5 grid md:grid-cols-5">
        {/*------------------------------------------------------------------------- first half -------------------------------------------------------------------------- */}
        <div className="card bg-base-100 shadow-xl col-span-2 m-2">
          <div className="card-body">
            {/* progress or lifecycle */}
            <h1 className="card-title mt-5 mx-3 justify-center items-center text-center">
              Plant Growth and Development Stages
            </h1>

            <div className="flex justify-center ">
              <ul className="steps steps-vertical lg:steps-horizontal">
                <li className="step">Seedling</li>
                <li className="step">Vegetative</li>
                <li className="step">Flowering</li>
                <li className="step">Fruit development</li>
                <li className="step">Harvest</li>
              </ul>
            </div>
            <div className="divider" />
            <h2 className="card-title justify-center items-center text-center">
              Watering system is in {wateringSystemMode} mode
            </h2>

            {/* inner card for manual mode */}
            <div className="card bg-slate-200 text-base-content">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Manual Mode</h2>
                <div className="card-actions justify-center items-center text-center">
                  <button
                    className={`btn btn-success btn-${btnState}`}
                    onClick={turnOn}
                  >
                    Turn ON
                  </button>
                  <button
                    className={`btn btn-error btn-${btnState}`}
                    onClick={turnOff}
                  >
                    Turn OFF
                  </button>
                </div>
              </div>
            </div>

            <div className="text-xl justify-center items-center text-center gap-4">
              <div>
                Watering system is now{" "}
                <b className={`${textState}`}>
                  <i>{wateringStatus}</i>
                </b>
              </div>
            </div>

            {/* inner card for changing from manual to auto */}
            <div className="card bg-slate-200 text-base-content">
              <div className="card-body items-center text-center">
                <h2 className="card-title">
                  Switch between manual and automatic mode
                </h2>
                <div className="card-actions justify-center items-center text-center">
                  <button
                    className="btn btn-info"
                    onClick={() => setWateringSystemMode("MANUAL")}
                  >
                    Manual Mode
                  </button>
                  <button
                    className="btn btn-accent"
                    onClick={() => setWateringSystemMode("AUTOMATIC")}
                  >
                    Automatic Mode
                  </button>
                </div>
              </div>
            </div>
            <div className="divider" />
          </div>
        </div>

        {/*------------------------------------------------------------------------- Second half -------------------------------------------------------------------------- */}

        <div className="card bg-base-100 col-span-3 m-2 ">
          <div className="grid grid-cols-3">
            {/* current soil moisture */}
            <div className="card bg-base-100 my-1 shadow-xl lg:col-span-3 col-span-3">
              <div className="card-body">
                <h2 className="card-title">Soil Moisture</h2>

                <div className="card-actions grid grid-cols-3">
                  <div className="card bg-base-100 shadow-md  col-span-3 ">
                    <div
                      className="card-body hover:bg-base-200"
                      onClick={() => setSoilDetails(!soilDetails)}
                    >
                      <h2 className="card-title">Average Soil Moisture</h2>
                      <div className="card-actions">
                        <div
                          class={`text-3xl font-extrabold text-center text-${moisturePercentageColor}`}
                        >
                          {sensor1Data} % ({sensor1mV} mV)
                        </div>
                      </div>
                    </div>
                  </div>
                  {soilDetails && (
                    <>
                      <div className="card bg-base-100 shadow-md  lg:col-span-1 col-span-3">
                        <div className="card-body">
                          <h2 className="card-title">Sensor 1</h2>
                          <div className="card-actions">
                            <div
                              class={`text-3xl font-extrabold text-center text-${moisturePercentageColor}`}
                            >
                              {sensor1Data} %
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card bg-base-100 shadow-md  lg:col-span-1 col-span-3">
                        <div className="card-body">
                          <h2 className="card-title">Sensor 2</h2>
                          <div className="card-actions">
                            <div
                              class={`text-3xl font-extrabold text-center text-${moisturePercentageColor}`}
                            >
                              {sensor2Data} %
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card bg-base-100 shadow-md  lg:col-span-1 col-span-3">
                        <div className="card-body">
                          <h2 className="card-title">Sensor 3</h2>
                          <div className="card-actions">
                            <div
                              class={`text-3xl font-extrabold text-center text-${moisturePercentageColor}`}
                            >
                              {sensor3Data} %
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="card bg-base-100 my-1 shadow-xl  lg:col-span-3 col-span-3">
              <div className="card-body">
                <h2 className="card-title">Water Consumption</h2>

                <div className="card-actions grid grid-cols-3 items-stretch">
                  {/* current soil moisture level */}
                  <div className="card bg-base-100 m-2 shadow-md  col-span-3 ">
                    <div
                      className="card-body hover:bg-base-200"
                      onClick={() => setWaterDetails(!waterDetails)}
                    >
                      <h2 className="card-title">
                        Estimated water requirement for the next day
                      </h2>

                      <div className="card-actions">
                        <div
                          class={`text-3xl font-extrabold text-center text-${moisturePercentageColor}`}
                        >
                          {tomPrediction} L
                        </div>
                      </div>
                    </div>
                  </div>
                  {waterDetails && (
                    <>
                      {/* duration */}
                      <div className="card bg-base-100 shadow-md m-2 lg:col-span-1 col-span-3">
                        <div className="card-body">
                          <h2 className="card-title">Real Time Flow Rate</h2>
                          <div className="card-actions">
                            <div class="text-3xl font-extrabold text-warning">
                              {realTimeFlowRate} L/min
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ltrs */}
                      <div className="card bg-base-100 shadow-md m-2 lg:col-span-1 col-span-3">
                        <div className="card-body">
                          <h2 className="card-title">Valve Position</h2>
                          <div className="card-actions">
                            <h3 class="text-3xl font-extrabold text-info">
                              {valvePosition}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* flow meter */}
                      <div className="card bg-base-100 shadow-md m-2 lg:col-span-1 col-span-3">
                        <div className="card-body">
                          <h2 className="card-title">Total Water Used</h2>
                          <div className="card-actions">
                            <h3 class="text-3xl font-extrabold text-info">
                              {totalWaterUsed} L
                            </h3>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              className="card bg-base-100 my-1 shadow-xl  lg:col-span-3 col-span-3"
              onClick={getEnvironment}
            >
              <div className="card-body  grid grid-cols-3">
                <h2 className="card-title  lg:col-span-3 col-span-3">
                  Environment
                </h2>

                {/* current temperature */}
                <div className="card bg-base-100 shadow-md m-2  lg:col-span-1 col-span-3">
                  <div className="card-body">
                    <h2 className="card-title">Temperature</h2>
                    <div className="card-actions">
                      <h3 class="text-3xl font-extrabold">{temperature} °C</h3>
                    </div>
                  </div>
                </div>

                {/* current Rainfall */}
                <div className="card bg-base-100 shadow-md m-2 lg:col-span-1 col-span-3">
                  <div className="card-body">
                    <h2 className="card-title">Rainfall</h2>
                    <div className="card-actions">
                      <h3 class="text-3xl font-extrabold ">0</h3>
                    </div>
                  </div>
                </div>

                {/* Current Humidity */}
                <div className="card bg-base-100 shadow-md m-2 lg:col-span-1 col-span-3">
                  <div className="card-body">
                    <h2 className="card-title">Humidity</h2>
                    <div className="card-actions">
                      <h3 class="text-3xl font-extrabold ">{humidity} %</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* current soil moisture level
              <div className="card bg-base-100 shadow-xl m-2 lg:col-span-1 col-span-3">
                <div className="card-body">
                  <h2 className="card-title">
                    Approx Water requirement for Tomorrow
                  </h2>

                  <div className="card-actions">
                    <div
                      class={`text-3xl font-extrabold text-center text-${moisturePercentageColor}`}
                    >
                      {tomPrediction} lts
                    </div>
                  </div>
                </div>
              </div> */}

            {/* duration
              <div className="card bg-base-100 shadow-xl m-2 lg:col-span-1 col-span-3">
                <div className="card-body">
                  <h2 className="card-title">Irrigation Duration</h2>
                  <div className="card-actions">
                    <div class="text-3xl font-extrabold text-warning">
                      {irrigationDuration} mins
                    </div>
                  </div>
                </div>
              </div> */}

            {/* ltrs
              <div className="card bg-base-100 shadow-xl m-2 lg:col-span-1 col-span-3">
                <div className="card-body">
                  <h2 className="card-title">Irrigation Quantity</h2>
                  <div className="card-actions">
                    <h3 class="text-3xl font-extrabold text-info">
                      {irrigationQuantity} ltrs
                    </h3>
                  </div>
                </div>
              </div> */}

            {/* current temperature
              <div className="card bg-base-100 shadow-xl m-2 lg:col-span-1 col-span-3">
                <div className="card-body">
                  <h2 className="card-title" onClick={getTemp}>
                    Temperature
                  </h2>
                  <div className="card-actions">
                    <h3 class="text-3xl font-extrabold">{temperature} °C</h3>
                  </div>
                </div>
              </div>

              current humidity
              <div className="card bg-base-100 shadow-xl m-2 lg:col-span-1 col-span-3">
                <div className="card-body">
                  <h2 className="card-title">Rainfall</h2>
                  <div className="card-actions">
                    <h3 class="text-3xl font-extrabold ">0 %</h3>
                  </div>
                </div>
              </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
