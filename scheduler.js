exports.handleSendMsg = (req, res) => {
    try {
      console.log(req.body);
    //   let dataObj = req.body;
    //   let toDataNumbers = dataObj.to;
    //   console.log(toDataNumbers);
    //   for (let i = 0; i < toDataNumbers.length; i++) {
    //     let data;
  
    //     if (dataObj.type === "chat") {
    //       data = qs.stringify({
    //         token: `${dataObj.from.token}`,
    //         to: `+${toDataNumbers[i].number}`,
    //         body: `${dataObj.body}`,
    //       });
    //     } else if (dataObj.type === "contact") {
    //       data = qs.stringify({
    //         token: `${dataObj.from.token}`,
    //         to: `+${toDataNumbers[i].number}`,
    //         contact: `${dataObj.body}@c.us`,
    //       });
    //     } else if (dataObj.type === "document") {
    //       console.log(dataObj.fileName);
    //       data = qs.stringify({
    //         token: dataObj.from.token,
    //         to: `+${toDataNumbers[i].number}`,
    //         filename: dataObj.fileName,
    //         document: dataObj.file,
    //         caption: dataObj.body,
    //       });
    //     } else if (dataObj.type === "image") {
    //       data = qs.stringify({
    //         token: `${dataObj.from.token}`,
    //         to: `+${toDataNumbers[i].number}`,
    //         image: `${dataObj.file}`,
    //         caption: `${dataObj.body}`,
    //       });
    //     } else if (dataObj.type === "video") {
    //       data = qs.stringify({
    //         token: `${dataObj.from.token}`,
    //         to: `+${toDataNumbers[i].number}`,
    //         video: `${dataObj.file}`,
    //         caption: `${dataObj.body}`,
    //       });
    //     } else if (dataObj.type === "audio") {
    //       data = qs.stringify({
    //         token: `${dataObj.from.token}`,
    //         to: `+${toDataNumbers[i].number}`,
    //         audio: `${dataObj.file}`,
    //       });
    //     } else if (dataObj.type === "location") {
    //       data = qs.stringify({
    //         token: `${dataObj.from.token}`,
    //         to: `+${toDataNumbers[i].number}`,
    //         address: `${dataObj.body}`,
    //         lat: `${dataObj.lat}`,
    //         lng: `${dataObj.lng}`,
    //       });
    //     }
  
    //     let config = {
    //       method: "post",
    //       url: `https://api.ultramsg.com/${dataObj.from.instanceID}/messages/${dataObj.type}`, //type
    //       headers: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //       },
    //       data: data,
    //     };
  
    //     axios(config).then((ress) => {
    //       console.log(ress.data);
    //     });
    //   }
  
    //   res.json({
    //     message: "sent",
    //   });
    } catch (err) {
      console.log(err);
    }
  };