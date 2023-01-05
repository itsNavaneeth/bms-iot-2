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
    const [moisturePercentageColor, setMoisturePercentageColor] = useState("bg-neutral");
    const [temperature, setTemperature] = useState(0.0);
    const [humidity, setHumidity] = useState(0.0);

    // turn on the valves
    const turnOn = () => {
        const options = {
            method: 'POST',
            url: 'https://industrial.api.ubidots.com/api/v1.6/variables/639179fb72ec12000c900fb2/values/',
            headers: {
                'content-type': 'application/json',
                'X-Auth-Token': 'BBFF-LtAIEbHEpPlRavdXFOC9Nu8SRnTN9y'
            },
            data: { value: 0 }
        };

        axios.request(options).then(function (response) {
            // console.log(response.data);
            setWateringStatus("ON");
            setTextState("text-success");
        }).catch(function (error) {
            console.error(error);
        });
    }

    // turn off the valves
    const turnOff = () => {
        const options = {
            method: 'POST',
            url: 'https://industrial.api.ubidots.com/api/v1.6/variables/639179fb72ec12000c900fb2/values/',
            headers: {
                'content-type': 'application/json',
                'X-Auth-Token': 'BBFF-LtAIEbHEpPlRavdXFOC9Nu8SRnTN9y'
            },
            data: { value: 1 }
        };

        // console.log("turn off");
        axios.request(options).then(function (response) {
            // console.log(response.data);
            setWateringStatus("OFF");
            setTextState("text-error");
        }).catch(function (error) {
            console.error(error);
        });
    }

    // toggle between manual and automatic mode
    useEffect(() => {
        if (wateringSystemMode === 'AUTOMATIC') {
            setBtnState("disabled");
            const interval = setInterval(() => {
                const options = {
                    method: 'GET',
                    url: 'https://api.thingspeak.com/channels/1958878/fields/3.json',
                    params: { results: '1' }
                };

                axios.request(options).then(function (response) {
                    // console.log(response.data);
                    console.log(response.data.feeds[0].field3);
                    setCurrentMoisture(response.data.feeds[0].field3);

                }).catch(function (error) {
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

        percentage = full - ((full - empty) * (currentMoisture - min_moisture)) / (max_moisture - min_moisture) + empty;
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
    // useEffect(() => {
    //     if (wateringSystemMode === 'MANUAL') {
    //     } else if (wateringSystemMode === 'AUTOMATIC')){
    //     if (currentMoisture > 1800) {
    //         turnOn();
    //     } else {
    //         turnOff();
    //     }
    // }

    // }, [currentMoisture, wateringSystemMode]);

    //function to call temperature and humidity
    const getTemp = () => {
        const options = {
            method: 'GET',
            url: 'https://api.openweathermap.org/data/2.5/weather',
            params: { lat: '13', lon: '77.5', appid: '406b154331868aa69ddc3dd64454c8c6' }
        };

        axios.request(options).then(function (response) {
            let temp = response.data.main.temp - 273.15;
            temp = temp.toFixed(2);
            setTemperature(temp);
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }

    return (
        <>
            <h1 class="font-bold text-3xl mt-5 mx-3 justify-center items-center text-center">Plant Monitoring System</h1>
            <div className="mt-4 mx-5 grid md:grid-cols-5">
                {/* first card */}
                <div className="card bg-base-100 shadow-xl col-span-2 m-2">
                    <div className="card-body">
                        <h2 className="card-title justify-center items-center text-center">Watering system is in {wateringSystemMode} mode</h2>

                        {/* inner card for manual mode */}
                        <div className="card bg-slate-200 text-base-content">
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">Manual Mode</h2>
                                <div className="card-actions justify-center items-center text-center">
                                    <button className={`btn btn-success btn-${btnState}`} onClick={turnOn}>Turn ON</button>
                                    <button className={`btn btn-error btn-${btnState}`} onClick={turnOff}>Turn OFF</button>
                                </div>
                            </div>
                        </div>

                        <div className="text-xl justify-center items-center text-center gap-4">
                            <div>Watering system is now <b className={`${textState}`}><i>{wateringStatus}</i></b></div>
                        </div>

                        {/* inner card for changing from manual to auto */}
                        <div className="card bg-slate-200 text-base-content">
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">Switch between manual and automatic mode</h2>
                                <div className="card-actions justify-center items-center text-center">
                                    <button className="btn btn-info" onClick={() => setWateringSystemMode('MANUAL')}>Manual Mode</button>
                                    <button className="btn btn-accent" onClick={() => setWateringSystemMode('AUTOMATIC')}>Automatic Mode</button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                {/* second card */}
                <div className="card bg-base-100 shadow-xl col-span-3  m-2">
                    <div className="card-body">
                        <h1 className="card-title justify-center">Plant Information</h1>
                        <div className="divider"></div>

                        {/* progress or lifecycle */}
                        <ul className="steps steps-vertical lg:steps-horizontal">
                            <li className="step step-success">Seedling</li>
                            <li className="step step-success">Vegetative</li>
                            <li className="step">Flowering</li>
                            <li className="step">Fruit development</li>
                            <li className="step">Harvest</li>
                        </ul>

                        <div className="divider"></div>

                        <div className="grid grid-cols-3">

                            {/* current soil moisture level */}
                            <div className="card bg-base-100 shadow-xl m-2 lg:col-span-1 col-span-3">
                                <div className="card-body">
                                    <h2 className="card-title">Current Soil Moisture</h2>
                                    <div className="card-actions">
                                        <div class={`stat-value text-center text-${moisturePercentageColor}`}>{moisturePercentage} %</div>
                                    </div>
                                </div>
                            </div>

                            {/* duration */}
                            <div className="card bg-base-100 shadow-xl m-2 lg:col-span-1 col-span-3">
                                <div className="card-body">
                                    <h2 className="card-title">Irrigation Duration</h2>
                                    <div className="card-actions">
                                        <div class="stat-value text-warning">{irrigationDuration} mins</div>
                                    </div>
                                </div>
                            </div>

                            {/* ltrs */}
                            <div className="card bg-base-100 shadow-xl m-2 lg:col-span-1 col-span-3">
                                <div className="card-body">
                                    <h2 className="card-title">Irrigation Quantity</h2>
                                    <div className="card-actions">
                                        <h3 class="stat-value text-info">{irrigationQuantity} ltrs</h3>
                                    </div>
                                </div>
                            </div>

                            {/* current soil moisture reading */}
                            <div className="card bg-base-100 shadow-xl m-2 lg:col-span-1 col-span-3">
                                <div className="card-body">
                                    <h2 className="card-title">Current Soil Moisture Reading</h2>
                                    <div className="card-actions">
                                        <h3 class="stat-value">{currentMoisture} V</h3>
                                    </div>
                                </div>
                            </div>

                            {/* current temperature */}
                            <div className="card bg-base-100 shadow-xl m-2 lg:col-span-1 col-span-3">
                                <div className="card-body">
                                    <h2 className="card-title" onClick={getTemp}>Temperature</h2>
                                    <div className="card-actions">
                                        <h3 class="stat-value">{temperature} °C</h3>
                                    </div>
                                </div>
                            </div>

                            {/* current humidity */}
                            <div className="card bg-base-100 shadow-xl m-2 lg:col-span-1 col-span-3">
                                <div className="card-body">
                                    <h2 className="card-title">Rainfall</h2>
                                    <div className="card-actions">
                                        <h3 class="stat-value ">0 %</h3>
                                    </div>
                                </div>
                            </div>

                        </div>



                    </div>
                </div>

            </div>
        </>
    );
}

export default Dashboard;