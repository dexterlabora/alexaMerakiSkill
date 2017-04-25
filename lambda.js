// Global Variables
const APIKEY = "00aee702e3920b9ac9253db80ccb6c310e7d74c1"; // Your API Key
const SHARD = "n142"; // or  dashboard
const ORGID = "383018" // Your Organization ID
const NETID = "L_642888846807138511" // Your Network ID



exports.handler = (event, context) => {
    console.log("event",event);
    
    // Setup HTTPS requests
    var https = require('https');
    const HEADERS = {
        "x-cisco-meraki-api-key": APIKEY
      };
    const HOSTNAME = SHARD+".meraki.com";  
    var options = {};
    
    // ****************
    // Meraki Functions
    // ****************

    function getOrganisation(){
      var body = '';
      console.log("IntentRequest: GetOrganisation");
      
      // Set API call options
      options = {
        method : "GET",
        hostname : HOSTNAME,
        path: "/api/v0/organizations",
        headers: HEADERS
      };
      
      // Make API call and send Response
      https.get(options, (response) => {
        response.on('data', (chunk) => { body += chunk })
        response.on('end', () => {
          console.log("response body: ",body);
          var data = JSON.parse(body)
          var orgName = data[0].name   
          context.succeed(
            generateResponse(
              buildSpeechletResponse(`Your Meraki organization is ${orgName}`, true), 
              {}
            )
          )
        })
      })
    }

    function getNetworks(){
      console.log("IntentRequest: GetNetworks");
      body = '';
      
      // Set API call options
      options = {
        hostname : HOSTNAME,
        path: "/api/v0/organizations/"+ORGID+"/networks",
        headers: HEADERS
      };
      
      // Make API call and send Response
      https.get(options, (response) => {
        response.on('data', (chunk) => { body += chunk })
        response.on('end', () => {
          console.log("response body: ",body);
          var data = JSON.parse(body)
          var speechOutput = "Your Meraki networks are ";
          for(var i=0; i<data.length; i++ ){
              var netName = data[i].name;
              console.log("netName "+netName);
              speechOutput += (", "+netName);
          }
          speechOutput += ". You have "+String(data.length+1)+" networks in total.";
          console.log("speachOutput: ", speechOutput);
          context.succeed(
            generateResponse(
              buildSpeechletResponse(speechOutput, true),  
              {}
            )
          )
        })
      })
    }

  function getDeviceList(){
    console.log("IntentRequest: GetDeviceList");
    body = '';
    
    // Set API call options
    options = {
      hostname : HOSTNAME,
      path: "/api/v0/networks/"+NETID+"/devices",
      headers: HEADERS
    };
    
    // Make API call and send Response
    https.get(options, (response) => {
      response.on('data', (chunk) => { body += chunk })
      response.on('end', () => {
        console.log("response", response);
        console.log("response body: ",body);
        
        var data = JSON.parse(body)
        var speechOutput = "Your devices are ";
        for(var i=0; i<data.length; i++ ){
            var deviceName = data[i].name || data[i].model; // list name, if not defined, list the model name
            console.log("netName "+deviceName);
            speechOutput += (", "+deviceName);
        }
        speechOutput += ". You have "+String(data.length+1)+" devices in total.";
        console.log("speachOutput: ", speechOutput);
        context.succeed(
          generateResponse(
            buildSpeechletResponse(speechOutput, true),  
            {}
          )
        )
      })
    })
  }

  function getClients(){
    console.log("IntentRequest: GetClients");
    body = '';
    
    // Set API call options
    options = {
      hostname : HOSTNAME,
      path: "/api/v0/devices/Q2LD-F9T7-PWWB/clients?timespan=300",
      headers: HEADERS
    };
    
    // Make API call and send Response
    https.get(options, (response) => {
      response.on('data', (chunk) => { body += chunk })
      response.on('end', () => {
        console.log("response", response);
        console.log("response body: ",body);
        
        var data = JSON.parse(body)
        var speechOutput = "Your clients are ";
        for(var i=0; i<data.length; i++ ){
            var clientName = data[i].dhcpHostname || data[i].description; // list dhcpHostname, if not defined, list the description
            console.log("clientName "+clientName);
            speechOutput += (", "+clientName);
        }
        speechOutput += ". You have "+String(data.length+1)+" clients in total.";
        console.log("speachOutput: ", speechOutput);
        context.succeed(
          generateResponse(
            buildSpeechletResponse(speechOutput, true),  
            {}
          )
        )
      })
    })
  }

    // Helper Function - Filter top values in list
    function getTopN(arr, prop, n) {
        // clone before sorting, to preserve the original array
        var clone = arr.slice(0); 
    
        // sort descending
        clone.sort(function(x, y) {
            if (x[prop] == y[prop]) return 0;
            else if (parseInt(x[prop]) < parseInt(y[prop])) return 1;
            else return -1;
        });
    
        return clone.slice(0, n || 1);
    }

  function getTrafficAnalysis(){
    console.log("IntentRequest: GetTrafficAnalysis");
    body = '';
    
    // Set API call options
    options = {
      hostname : HOSTNAME,
      path: "/api/v0/networks/"+NETID+"/traffic?timespan=7200",
      headers: HEADERS
    };
    
    // Make API call and send Response
    https.get(options, (response) => {
      response.on('data', (chunk) => { body += chunk })
      response.on('end', () => {
        console.log("response", response);
        console.log("response body: ",body);
        
        var data = JSON.parse(body);
        var topApps = getTopN(data, "recv",3);
        console.log("topApps ",topApps);
        var speechOutput = "Your top three applications are ";
        for(var i=0; i<topApps.length; i++ ){
            speechOutput += (", "+topApps[i].application+" receiving "+String(Math.floor(topApps[i].recv/1000))+" kilobytes");
        }
        console.log("speachOutput: ", speechOutput);
        context.succeed(
          generateResponse(
            buildSpeechletResponse(speechOutput, true),  
            {}
          )
        )
      })
    })
  }

  function getLicenses(){
    var body = '';
      console.log("IntentRequest: GetOrganisation");
      
      // Set API call options
      options = {
        method : "GET",
        hostname : HOSTNAME,
        path: "/api/v0/organizations/"+ORGID+"/licenseState",
        headers: HEADERS
      };
      
      // Make API call and send Response
      https.get(options, (response) => {
        response.on('data', (chunk) => { body += chunk })
        response.on('end', () => {
          console.log("response body: ",body);
          var data = JSON.parse(body)
          var expirationDate = data.expirationDate; 
          var status = data.status;
          var speechOutput = ("Your Meraki license status is "+status+" with an expiration date of "+String(expirationDate));
          context.succeed(
            generateResponse(
              buildSpeechletResponse(speechOutput, true), 
              {}
            )
          )
        })
      })
  }


  // Alexa Logic

  try {
    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`)
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Welcome to the Meraki Alexa Skilll.  You can ask me about your organisation, networks, Meraki devices, clients, traffic and licensing ", true),
            {}
          )
        )
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`)

        switch(event.request.intent.name) {
          case "GetOrganisation":
            getOrganisation();            
            break;

          case "GetNetworks":
            getNetworks();         
            break;
            
          case "GetDeviceList":
            getDeviceList();     
            break;     

          case "GetClients":
            getClients();     
            break;

          case "GetTrafficAnalysis":
            getTrafficAnalysis();
            break;

          case "GetLicenses":
            getLicenses();
            break;

          default:
            throw "Invalid intent"
        }

        break;

      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`)
        break;

      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

    }

  } catch(error) { context.fail(`Exception: ${error}`) }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}