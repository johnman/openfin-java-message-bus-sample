export async function publishInit() {
    const buttonPublish = document.getElementById("apiv2-publish");
    const topicElement = document.getElementById("apiv2-publish-topic");
    const intervalElement = document.getElementById("apiv2-publish-interval");
    const dataElement = document.getElementById("apiv2-publish-data");
    const lastSentElement = document.getElementById("apiv2-publish-lastsent");
  
    fin.desktop.main(userAppConfigArgs => {
      console.log(userAppConfigArgs);
      if (
        userAppConfigArgs !== undefined &&
        userAppConfigArgs.initOptions !== undefined
      ) {
        try {
          let initOptions = JSON.parse(userAppConfigArgs.initOptions);
  
          if (initOptions.topic !== undefined) {
            topicElement.value = initOptions.topic;
          }
  
          if (initOptions.interval !== undefined) {
            intervalElement.value = initOptions.interval;
          }
  
          if (initOptions.data !== undefined) {
            let data;
  
            if (Array.isArray(initOptions.data)) {
              data = initOptions.data;
            } else {
              data = [initOptions.data];
            }
  
            dataElement.value = JSON.stringify(data, undefined, 4);
          }
        } catch (error) {
          lastSentElement.innerText =
            "Received initial data on load but could not parse the JSON.";
        }
      }
    });
  
    buttonPublish.onclick = () => {
      console.log("button clicked");
      let topic = topicElement.value;
      let interval = intervalElement.value;
      let data;
      try {
        data = JSON.parse(dataElement.value);
      } catch {
        lastSentElement.innerText =
          "Error parsing JSON. Please ensure it is valid JSON";
        return;
      }
      if (topic === null || topic === "") {
        topic = "test";
      }
  
      if (interval === null || interval === "") {
        interval = 1000;
      } else {
        interval = parseInt(intervalElement.value, 10);
      }
  
      if (Array.isArray(data)) {
        let intervalTotal = interval;
        data.forEach(entry => {
          intervalTotal += interval;
          setTimeout(() => {
            fin.InterApplicationBus.publish(topic, entry)
              .then(() => {
                console.log(
                  "Published: " + JSON.stringify(entry) + " on topic: " + topic
                );
                lastSentElement.innerText = new Date().toLocaleString();
              })
              .catch(err => {
                console.log(err);
                lastSentElement.innerText = "Error Sending: " + err;
              });
          }, intervalTotal);
        });
      }
    };
  }
  publishInit();
  