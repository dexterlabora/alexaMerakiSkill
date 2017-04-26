
# Alexa Skill with the Cisco Meraki Dashboard API

This is a simple demonstration using the Meraki Dashboard API with Alexa.

Get status for your Organization, Network, Device, Client and License status

*Mainly Written By Cory Guynn after he got sick of Steve Harrison asking him stupid questions*

*MIT LICENSE, 2017*
 
# Instructions

### Copy the `lambda.js` code contents into the code editor in the AWS Lambda Function for your Alexa skill.

![Alt text](/screenshots/Lambda%20Code%20Editor.png "Lambda Code Editor")

#### Update the Global Variables in the code with your content. You will need an API key for your Meraki Dashboard.

```
// Global Variables
const APIKEY = "YourAPIKey"; // Your API Key
const ORGID = "YourOrgId"; // Your Organization ID
const NETID = "YourNetID"; // Your Network ID
const SERIAL = "YourSerial"; // Your Serial Number (for clients on a device)
const SHARD = "dashboard"; // example:  n142
```

### Copy the `intents.js` file contents into the Interaction Model's Code Editor 
  The intents file will be used to trigger the various functions based on 
  utterances. Review that file for keywords and phrases.
  
![Alt text](/screenshots/Alexa%20Skill%20Builder%20-%20Intents.png "Alexa Skill Builder")


### Test wtih Alexa Service Simulator
 Enter an Intent name and utterance. Then click the "Ask Meraki skill" button to trigger the Lambda function.
 
![Alt text](/screenshots/Alexa%20Service%20Simulator.png "Alexa Service Simulator")

### Debug Lambda Function with CloudWatch

![Alt text](https://github.com/dexterlabora/alexaMerakiSkill/blob/master/screenshots/Lamda%20CloudWatch%20Logs.png "CloudWatch Logs")
   



## Resources:
* Meraki Dashboard API Docs
http://developers.meraki.com/tagged/Dashboard
* Enable and get Meraki API Key
https://documentation.meraki.com/zGeneral_Administration/Other_Topics/The_Cisco_Meraki_Dashboard_API
* Postman Collection, to easily interact with Meraki APIs. Use this to obtain your OrgID, NetID, etc.
https://documenter.getpostman.com/view/897512/meraki-dashboard-prov-api/2To9xm#intro

* Amazon Alexa Lambda Function
https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function

## Utterances 
*(Intent)*        *(utterance)*
```
GetOrganisation my organisation name
GetOrganisation what's my organisation
GetOrganisation what is my organisation
GetOrganisation what's my organisation name
GetOrganisation what is my organisation name

GetNetworks networks
GetNetworks what are my networks                
GetNetworks list my networks  

GetDeviceList devices                           
GetDeviceList network devices
GetDeviceList meraki kit                        

GetClients clients
GetClients clients on AP                        
GetClients clients on my AP                     
GetClients clients in the office                

GetTrafficAnalysis traffic analysis
GetTrafficAnalysis interesting traffic
GetTrafficAnalysis what's going on on my network
GetTrafficAnalysis to spy on my users

GetLicenses license 
GetLicenses license state
GetLicenses license expiration
GetLicenses when does my license expire
```




