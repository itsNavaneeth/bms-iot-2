import React from 'react';

//if mode = 0 -> returnns Soil Moisture data
//if mode = 1 -> returnns temperature data
//if mode = 2 -> returnns precipitation data
//else all 3 data sent
const convData = (info,mode) => {
  let finalData, soilMoistureObj,temperatureObj, precipitationObj, cordObj, allData;

  soilMoistureObj = { id: "Soil Moisture", data: [] };
  if(mode==-1)
   {
    info.feeds.forEach((element) => {
      cordObj = { x: "", y: "" };
      cordObj.x = element.created_at;
      cordObj.x = cordObj.x.substring(0,10);
      cordObj.y = element.field3;
      soilMoistureObj.data.push(cordObj);
    });

    return soilMoistureObj;

    }

      finalData=[];
      
      temperatureObj = { id: "Temperature", data: [] };
      precipitationObj = { id: "Precipitation", data: [] };
      allData = { id: "Environment", data: [] };

      info.feeds.forEach((element) => {
        cordObj = { x: "", y: "" };
        cordObj.x = element.created_at;
        cordObj.x = cordObj.x.substring(0,10);
        cordObj.y = element.field1;
        soilMoistureObj.data.push(cordObj);

        cordObj = { x: "", y: "" };
        cordObj.x = element.created_at;
        cordObj.x = cordObj.x.substring(0,10);
        cordObj.y = element.field2;
        temperatureObj.data.push(cordObj);

        cordObj = { x: "", y: "" };
        cordObj.x = element.created_at;
        cordObj.x = cordObj.x.substring(0,10);
        cordObj.y = element.field3;
        precipitationObj.data.push(cordObj);

        cordObj = { x: "", soilData: "", tempData:"", rainData:"" };
        cordObj.x = element.created_at;
        cordObj.x = cordObj.x.substring(0,10);
        cordObj.soilData = element.field1;
        cordObj.tempData = element.field2;
        cordObj.rainData = element.field3;
        allData.data.push(cordObj);
      });
      finalData[0]=soilMoistureObj;
      finalData[1]=temperatureObj;
      finalData[2]=precipitationObj;
      finalData[3]=allData;
      switch(mode)
      {
        case 0: return soilMoistureObj; break;
        case 1: return temperatureObj; break;
        case 2: return precipitationObj; break;
        case 3: return allData;break;
        default: return finalData;

      }

};

 export default convData;