import axios from "axios";
import { useState, useEffect } from "react";

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
  const [tomPrediction, setTomPrediction] = useState(0.0);
  const [fieldValue, setFieldValue] = useState(null);
  const [sensorData, setSensorData] = useState(null);

  // ---------------------------------------------------------------------Valve Related---------------------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------Data Display---------------------------------------------------------------------------------------
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

  // Call for channel data
  useEffect(() => {
    fetch("https://api.thingspeak.com/channels/2019443/feeds.json?results=1")
      .then((response) => response.json())
      .then((data) => {
        const array = Object.values(data);
        console.log(array);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // trigger when to turn on and turn off based on threshold
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

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://api.thingspeak.com/channels/1978647/fields/3.json?results=1"
      );
      const data = await response.json();
      setFieldValue(data.feeds[0].field3);
      let temp = fieldValue;

      temp = (temp * 100) / 0.72;

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

  //function to call temperature and humidity
  const getTemp = () => {
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
        let temp = response.data.main.temp - 273.15;
        temp = temp.toFixed(2);
        setTemperature(temp);
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
              X more days till harvest
            </h1>

            <div className="flex justify-center ">
              <ul className="steps steps-vertical lg:steps-horizontal">
                <li className="step step-success">Seedling</li>
                <li className="step step-success">Vegetative</li>
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
                    <div className="card-body">
                      <h2 className="card-title">Average Soil Moisture</h2>
                      <div className="card-actions">
                        <div
                          class={`text-3xl font-extrabold text-center text-${moisturePercentageColor}`}
                        >
                          {moisturePercentage} %
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-100 shadow-md  lg:col-span-1 col-span-3">
                    <div className="card-body">
                      <h2 className="card-title">Sensor 1</h2>
                      <div className="card-actions">
                        <div
                          class={`text-3xl font-extrabold text-center text-${moisturePercentageColor}`}
                        >
                          {sensorData} %
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
                          {moisturePercentage} %
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
                          {moisturePercentage} %
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 my-1 shadow-xl  lg:col-span-3 col-span-3">
              <div className="card-body">
                <h2 className="card-title">Water Consumption</h2>

                <div className="card-actions grid grid-cols-3 items-stretch">
                  {/* current soil moisture level */}
                  <div className="card bg-base-100 shadow-md m-2 lg:col-span-1 col-span-3">
                    <div className="card-body">
                      <h2 className="card-title">
                        Estimated water requirement
                      </h2>

                      <div className="card-actions">
                        <div
                          class={`text-3xl font-extrabold text-center text-${moisturePercentageColor}`}
                        >
                          {tomPrediction} lts
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* duration */}
                  <div className="card bg-base-100 shadow-md m-2 lg:col-span-1 col-span-3">
                    <div className="card-body">
                      <h2 className="card-title">Irrigation Duration</h2>
                      <div className="card-actions">
                        <div class="text-3xl font-extrabold text-warning">
                          {irrigationDuration} mins
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ltrs */}
                  <div className="card bg-base-100 shadow-md m-2 lg:col-span-1 col-span-3">
                    <div className="card-body">
                      <h2 className="card-title">Irrigation Quantity</h2>
                      <div className="card-actions">
                        <h3 class="text-3xl font-extrabold text-info">
                          {irrigationQuantity} ltrs
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 my-1 shadow-xl  lg:col-span-3 col-span-3">
              <div className="card-body  grid grid-cols-3">
                <h2 className="card-title  lg:col-span-3 col-span-3">
                  Environment
                </h2>

                {/* current temperature */}
                <div className="card bg-base-100 shadow-md m-2  lg:col-span-1 col-span-3">
                  <div className="card-body">
                    <h2 className="card-title" onClick={getTemp}>
                      Temperature
                    </h2>
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
                      <h3 class="text-3xl font-extrabold ">0 %</h3>
                    </div>
                  </div>
                </div>

                {/* Current Humidity */}
                <div className="card bg-base-100 shadow-md m-2 lg:col-span-1 col-span-3">
                  <div className="card-body">
                    <h2 className="card-title">Humidity</h2>
                    <div className="card-actions">
                      <h3 class="text-3xl font-extrabold ">0 %</h3>
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
