export async function subscribeInit() {
    const buttonSubscribe = document.getElementById("apiv2-subscribe");
    const buttonUnSubscribe = document.getElementById("apiv2-unsubscribe");
    const topicElement = document.getElementById("apiv2-subscribe-topic");
    const sourceElement = document.getElementById("apiv2-subscribe-source");
    const dataElement = document.getElementById("apiv2-subscribe-data");
    const lastReceivedElement = document.getElementById(
      "apiv2-subscribe-lastreceived"
    );
    buttonUnSubscribe.disabled = true;
    let initOptions;
    let subscribedTopic;
    let subscribedSource;
  
    async function unsubscribe(source, topic, listener) {
      let result;
      try {
        result = await fin.InterApplicationBus.unsubscribe(
          source,
          topic,
          listener
        );
      } catch (error) {
        console.log("Error trying to unsubscribe: ", error);
      }
      return result;
    }
  
    function listener(passedMessage) {
      console.log("Received Message:" + JSON.stringify(passedMessage));
      lastReceivedElement.innerText = new Date().toLocaleString();
      dataElement.value = JSON.stringify(passedMessage, undefined, 4);
    }
  
    fin.desktop.main(userAppConfigArgs => {
      console.log(userAppConfigArgs);
      if (
        userAppConfigArgs !== undefined &&
        userAppConfigArgs.initOptions !== undefined
      ) {
        try {
          let initOptions = JSON.parse(userAppConfigArgs.initOptions);
        } catch (error) {
          lastReceivedElement.innerText =
            "Received initial data on load but could not parse the JSON.";
        }
      }
    });
  
    buttonUnSubscribe.onclick = async () => {
      console.log("unsubscribe button clicked");
      buttonSubscribe.disabled = false;
      buttonUnSubscribe.disabled = true;
      dataElement.value = "";
      await unsubscribe({ uuid: subscribedSource }, subscribedTopic, listener)
        .then(() => console.log("Unsubscribe"))
        .catch(err => console.log(err));
    };
  
    buttonSubscribe.onclick = () => {
      console.log("subscribe button clicked");
      let topic = topicElement.value;
      let source = sourceElement.value;
  
      if (topic === null || topic === "") {
        topic = "test";
      }
  
      if (source === null || source === "") {
        source = "*";
      }
  
      fin.InterApplicationBus.subscribe({ uuid: source }, topic, listener)
        .then(() => {
          console.log("Subscribed to " + source + " for topic " + topic);
          buttonSubscribe.disabled = true;
          buttonUnSubscribe.disabled = false;
          subscribedTopic = topic;
          subscribedSource = source;
        })
        .catch(err => console.log(err));
    };
  }
  subscribeInit();
  