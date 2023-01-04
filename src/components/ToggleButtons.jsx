import axios from "axios";
import { useState, useEffect } from "react";


const ToggleButtons = () => {
    // const [mode, SetMode] = useState("Click on the buttons");
    const [modeStatus, SetModeStatus] = useState("ZZZ");
    const [moisture, SetMoisture] = useState(0.0);
    const [btncolor, SetBtnColor] = useState("");
    const [water, SetWater] = useState("Click on the buttons");
    const [vsm, SetVsm] = useState(0.0);


    const [mode, setMode] = useState('automatic');
    const [count, setCount] = useState(0);

    useEffect(() => {
        // let dummy = (2700 - moisture) * 0.72 / 100;
        // SetVsm(dummy);

        let x_new = 0.0;
        let a = 0;
        let b = 100;

        let min_x = 900;
        let max_x = 2700;
        let x = 12;

        x_new = b - ((b - a) * (moisture - min_x)) / (max_x - min_x) + a;
        x_new = x_new.toFixed(2);
        SetVsm(x_new);

    }, [moisture]);

    useEffect(() => {
        if (mode === 'automatic') {
            SetBtnColor("disabled");
            const interval = setInterval(() => {
                // setCount(count + 1);


                const options = {
                    method: 'GET',
                    url: 'https://api.thingspeak.com/channels/1958878/fields/3.json',
                    params: { results: '1' }
                };

                axios.request(options).then(function (response) {
                    // console.log(response.data);
                    console.log(response.data.feeds[0].field3);
                    SetMoisture(response.data.feeds[0].field3);

                }).catch(function (error) {
                    console.error(error);
                });

            }, 1000);

            return () => clearInterval(interval);
        } else {
            SetBtnColor("");
        }
    }, [mode, count]);


    // function onChangeValue(event) {
    //     SetModeStatus(event.target.value);
    //     console.log(event.target.value);

    // }


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

        console.log("turn on");
        axios.request(options).then(function (response) {
            // console.log(response.data);
            SetWater("Watering system is ON");
        }).catch(function (error) {
            console.error(error);
        });
    }

    const turnOff = () => {
        console.log("BYEEEEEEEEEEEEEEEEEEE");
        SetModeStatus("welcome");
        // setMode("manual");

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
            SetWater("Watering system is OFF");
        }).catch(function (error) {
            console.error(error);
        });
    }

    useEffect(() => {
        if (moisture > 1800) {
            turnOn();
        } else {
            turnOff();
        }
    }, [moisture]);


    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-5xl font-normal leading-normal mt-0 mb-2">
                    System is in {mode} Mode
                </h2>
            </div>

            <div className="flex items-center justify-center">
                <div className="flex flex-col my-3">
                    <button className={`btn btn-success my-3 btn-${btncolor}`} onClick={turnOn}>Turn On</button>
                    <button className={`btn btn-error my-3 btn-${btncolor}`} onClick={turnOff}>Turn Off</button>
                    <p>{water}</p>
                </div>
            </div>

            <div className="divider"></div>

            <div className="flex flex-col items-center justify-center flex-end">
                {/* <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text mr-2">Manual Mode</span>
                        <input type="radio" name="radio-10" className="radio checked:radio-info" onChange={handleChange} checked />
                    </label>
                </div> */}
                {/* <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text mr-2">Automatic Mode</span>
                        <input type="radio" name="radio-10" className="radio checked:radio-success" checked />
                    </label>
                </div> */}



                {/* <div onChange={onChangeValue}>
                    <label className="label cursor-pointer">
                        <span className="label-text mr-2">Manual Mode</span>
                        <input type="radio" value="Manual" name="modeStatus" className="radio checked:radio-info" checked={modeStatus === "Manual"} />
                    </label>
                    <label className="label cursor-pointer">
                        <span className="label-text mr-2">Automatic Mode</span>
                        <input type="radio" value="Automatic" name="modeStatus" className="radio checked:radio-success" checked={modeStatus === "Automatic"} />
                    </label> */}

                {/* <input type="radio" value="Male" name="gender" checked={gender === "Male"} /> Male
                    <input type="radio" value="Female" name="gender" checked={gender === "Female"} /> Female
                    <input type="radio" value="Other" name="gender" checked={gender === "Other"} /> Other 
                    </div>*/}
            </div>

            <div className="flex flex-col items-center justify-center flex-end">
                <p>Current Volumetric Moisture: {vsm}</p>
                <button className="btn btn-info my-3" onClick={() => setMode('manual')}>Set to manual</button>
                <button className="btn btn-success my-3" onClick={() => setMode('automatic')}>Set to automatic</button>
            </div>
        </>
    );
}

export default ToggleButtons;