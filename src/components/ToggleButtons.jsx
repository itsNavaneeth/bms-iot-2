import axios from "axios";
import { useState } from "react";


const ToggleButtons = () => {
    const [mode, SetMode] = useState("Click on the buttons to start the watering system");
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
            console.log(response.data);
            SetMode("Watering system is on");
        }).catch(function (error) {
            console.error(error);
        });
    }

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

        console.log("turn off");
        axios.request(options).then(function (response) {
            console.log(response.data);
            SetMode("Watering system is off");
        }).catch(function (error) {
            console.error(error);
        });
    }




    return (
        <>
            <div className="flex items-center justify-center">
                <div className="flex flex-col my-3 w-140">
                    <button className="btn btn-success my-3" onClick={turnOn}>Turn On</button>
                    <button className="btn btn-error my-3" onClick={turnOff}>Turn Off</button>
                    <div>{mode}</div>
                </div>
            </div>
        </>
    );
}

export default ToggleButtons;