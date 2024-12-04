const axios = require('axios');  // For making HTTP requests (to Voiceflow API)
require('dotenv').config();
const VF_API_KEY = process.env.VF_API_KEY;

// Function to send requests to Voiceflow Dialog Manager API
module.exports.interact = async function interact(chatID, request) {
    let messages = [];
    console.log(`request: ` + JSON.stringify(request));

    try {
        const response = await axios({
            method: "POST",
            url: `https://general-runtime.voiceflow.com/state/user/${chatID}/interact`,
            headers: {
                Authorization: VF_API_KEY
            },
            data: {
                request
            }
        });

        // Process response
        for (const trace of response.data) {
            switch (trace.type) {
                case "text":
                case "speak": {
                    messages.push(this.filter(trace.payload.message));
                    break;
                }
                case "end": {
                    messages.push("Bye!");
                    break;
                }
            }
        }
    } catch (error) {
        console.error("Error interacting with Voiceflow API:", error);
    }

    console.log(`response: ` + messages.join(","));
    return messages;
};

// Function to clean up text messages
module.exports.filter = function filter(string) {
    string = string.replace(/\&#39;/g, '\'')
                   .replace(/(<([^>]+)>)/ig, "")
                   .replace(/\&/g, ' and ')
                   .replace(/[&\\#,+()$~%*?<>{}]/g, '')
                   .replace(/\s+/g, ' ').trim()
                   .replace(/ +(?= )/g,'');
    return string;
};

// Function to extract detected entities from Alexa request
module.exports.alexaDetectedEntities = function alexaDetectedEntities(alexaRequest) {
    let entities = [];
    const entitiesDetected = alexaRequest.request.intent.slots;
    for (const entity of Object.values(entitiesDetected)) {
        entities.push({
            name: entity.name,
            value: entity.value
        });
    }
    return entities;
};
