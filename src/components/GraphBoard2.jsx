import axios from "axios";
import { useState, useEffect } from "react";
import BiaxialChart from "./BiaxialChart";
import convData from "./convert";
import StackedAreaChart from "./StackedAreaChart";
import LineChartz from "./LineChart";

const Dashboard2 = () => {
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
        console.log("refreshed");
        fetch("https://api.thingspeak.com/channels/1958878/fields/3.json?minutes")
            .then((response) => response.json())
            .then((info) => {
                const data = convData(info, -1);
                setWaterData(data);
            });

        const interval = setInterval(() => {
            console.log("refreshed");
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

    return (
        <>

        </>
    );
};

export default Dashboard2;
