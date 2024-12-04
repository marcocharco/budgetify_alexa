const Alexa = require('ask-sdk-core');  // Alexa Skills Kit SDK
const utils = require('./util');       // Import the utility functions (like interact, alexaDetectedEntities)

// LaunchRequestHandler - Handles skill launch
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        let chatID = Alexa.getUserId(handlerInput.requestEnvelope).substring(0, 8);
        const messages = await utils.interact(chatID, { type: "launch" });

        return handlerInput.responseBuilder
            .speak(messages.join(" "))
            .reprompt(messages.join(" "))
            .getResponse();
    }
};

// ListenerIntentHandler - Handles user input (IntentRequests)
const ListenerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    async handle(handlerInput) {
        let chatID = Alexa.getUserId(handlerInput.requestEnvelope).substring(0, 8);
        const intent = Alexa.getIntentName(handlerInput.requestEnvelope);
        const entitiesDetected = utils.alexaDetectedEntities(handlerInput.requestEnvelope);

        const request = { 
            type: "intent", 
            payload: { 
                intent: {
                    name: intent
                },
                entities: entitiesDetected
            }
        };

        const messages = await utils.interact(chatID, request);

        return handlerInput.responseBuilder
            .speak(messages.join(" "))
            .reprompt(messages.join(" "))
            .getResponse();
    }
};

// GetBudgetStatusIntentHandler - Handles the GetBudgetStatusIntent
const GetBudgetStatusIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetBudgetStatusIntent';
    },
    async handle(handlerInput) {
        let chatID = Alexa.getUserId(handlerInput.requestEnvelope).substring(0, 8);
        const intent = Alexa.getIntentName(handlerInput.requestEnvelope);
        const entitiesDetected = utils.alexaDetectedEntities(handlerInput.requestEnvelope);

        const request = { 
            type: "intent", 
            payload: { 
                intent: {
                    name: intent
                },
                entities: entitiesDetected
            }
        };

        const messages = await utils.interact(chatID, request);
        
        return handlerInput.responseBuilder
            .speak(messages.join(" "))
            .reprompt(messages.join(" "))
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    async handle(handlerInput) {
        try {
            const speechText = 'You can ask me about your budget!';
            
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .withSimpleCard('You can ask me about your budget!', speechText)
                .getResponse();
        } catch (error) {
            console.error("Error handling HelpIntent:", error);
            throw error; // This will trigger the ErrorHandler if there's a failure
        }
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
            || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard('Goodbye!', speechText)
        .withShouldEndSession(true)
        .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any clean-up logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};


// Error handling (for unhandled exceptions or errors)
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ListenerIntentHandler,
        GetBudgetStatusIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
