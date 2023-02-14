import { useState, useEffect } from "react";
import convData from "./convert";
import LineChartz from "./LineChart";

const LiveBoard = () => {
    //graph section
    const [waterData, setWaterData] = useState([]);
    const [liveDataVal, setliveDataVal] = useState("(Fetching data)");
    const [livePercentage, setLivePercentage] = useState("(Fetching data)");
    const [moisturePercentageColor, setMoisturePercentageColor] = useState("bg-neutral");


    





    //Fetch the machine learning model ressults from thingspeak
    useEffect(() => {
        // console.log("Hello");
        fetch("")
            .then((response) => response.json())
            .then((info) => {
                // console.table(info);
                const data = convData(info, -1);
                setWaterData(data);
                setliveDataVal(waterData.data[waterData.data.length - 1].y);
                // console.log(waterData.data[waterData.data.length - 1].y);

                let percentage = 0.0;
                let empty = 0;
                let full = 100;
                let min_moisture = 800;
                let max_moisture = 2800;

                percentage = full - ((full - empty) * (liveDataVal - min_moisture)) / (max_moisture - min_moisture) + empty;
                // percentage = 80;
                if (percentage > 100) {
                    percentage = 100;
                }
                if (percentage < 0) {
                    percentage = 0;
                }
                percentage = percentage.toFixed(2);

                if (percentage < 100 && percentage > 0) {
                    setLivePercentage(percentage);
                } else {
                    setLivePercentage("Computing...");
                }




                if (percentage < 30) {
                    setMoisturePercentageColor("error");
                } else if (percentage < 60) {
                    setMoisturePercentageColor("warning");
                } else if (percentage < 100) {
                    setMoisturePercentageColor("success");
                }

            });


    }, []);


    return (
        <>
            <h1 className="font-bold text-3xl mt-5 mx-3 justify-center items-center text-center">
                Live Data
            </h1>
            <p className="justify-center items-center text-center">Live Reading from Soil Moisture Sensor</p>
            <div className="mt-4 mx-1 grid md:grid-cols-10">
                {/* first card */}
                <div className="card col-span-10 lg:col-span-7 m-2">
                    <div className="p-2">
                        {/* <h2 className="card-title justify-center items-center text-center">Graph will come here</h2> */}

                        {/* <div class="flex ...">
                            <div class="flex-auto w-32 h-96">
                                {(mode == 5 && <StackedAreaChart data={allData} />)}
                                {(mode == 4 && <LineChartz data={lineData} />)}
                                {(mode == 1 || mode == 2 || mode == 3) && <BiaxialChart data={lineData} mode={mode} />}
                            </div>

                        </div> */}

                        <div class="flex ...">
                            <div class="flex-auto w-24 h-96"><LineChartz data={waterData} /></div>
                        </div>


                        {/* <StackedAreaChart data={allData} /> */}
                    </div>
                    {/* <div className="justify-center items-center text-center">Time Series</div> */}

                </div>

                {/* second card */}
                <div className="card bg-base-100 border-2 border-black col-span-10 lg:col-span-3 m-2 my-auto">
                    <div className="card-body">
                        <h1 className="card-title justify-center">Live Soil Moisture in mVolts</h1>
                        <h3 class="card-title justify-center items-center text-center">{liveDataVal} mV</h3>
                        <div className="divider"></div>
                        <h1 className="card-title justify-center">Live Soil Moisture Percentage</h1>
                        <h3 class={`card-title justify-center items-center text-center text-${moisturePercentageColor}`}>{livePercentage} %</h3>

                    </div>
                    {/* <div className="card-body">
                        <h1 className="card-title justify-center">Live Soil Moisture %</h1>
                        <h3 class="stat-value justify-center items-center text-center">{ } V</h3>
                        <div className="divider"></div>

                    </div> */}
                </div>
            </div>
        </>
    );
};

export default LiveBoard;
