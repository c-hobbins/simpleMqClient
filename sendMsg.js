'use strict';
/*
  Copyright (c) IBM Corporation 2017

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

   Contributors:
     Mark Taylor - Initial Contribution
*/

//CH: For brevity in simple program removed all non-essential comments from original author

// Import the MQ package
var mq = require('ibmmq');
const path = require('path');
const cliArgs = require('commander');
const os = require('os');

var MQC = mq.MQC;

function formatErr(err) {
  return  "MQ call failed in " + err.message;
}

function toHexString(byteArray) {
  return byteArray.reduce((output, elem) =>
    (output + ('0' + elem.toString(16)).slice(-2)),
    '');
}

// Define some functions that will be used from the main flow
function putMessage(hObj) {

  var msg = "Hello Erik!:)\n";
  msg += "Message successully sent from NodeJS MQI client!\n";
  msg += "Date of message being sent: " + new Date() + "\n";
  msg += "Container Details: \n";
  msg += "HOSTNAME=" + os.hostname + "::\n";
  msg += "TYPE=" + os.type + ":";
  msg += "PLATFORM=" + os.platform + ":";
  msg += "ARCH=" + os.arch;

  var mqmd = new mq.MQMD(); // Defaults are fine.
  var pmo = new mq.MQPMO();

  // Describe how the Put should behave
  pmo.Options = MQC.MQPMO_NO_SYNCPOINT |
                MQC.MQPMO_NEW_MSG_ID |
                MQC.MQPMO_NEW_CORREL_ID;

  mq.Put(hObj,mqmd,pmo,msg,function(err) {
    if (err) {
      console.log(formatErr(err));
    } else {
      console.log("MsgId: " + toHexString(mqmd.MsgId));
      console.log("MQPUT successful");
    }
  });
}

// When we're done, close queues and connections
function cleanup(hConn,hObj) {
  mq.Close(hObj, 0, function(err) {
    if (err) {
      console.log(formatErr(err));
    } else {
      console.log("MQCLOSE successful");
    }
    mq.Disc(hConn, function(err) {
      if (err) {
        console.log(formatErr(err));
      } else {
        console.log("MQDISC successful");
      }
    });
  });
}

// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the queue, and then we can put a message.


cliArgs
  .requiredOption('-qm, --queue-manager <qm>', 'Name of the target Queue Manager.')
  .requiredOption('-q, --queue-name <q>', 'Name of the target Queue.')
  .option('-u, --user <u>', 'If using MQSCP then must provide any value...')
  .option('-p, --password <p>', 'Not implememted yet...')
  .option('-d, --debug', 'output for extra debugging')

cliArgs.version('version: 0.1');

cliArgs.parse(process.argv);
 
if (cliArgs.debug) console.log(cliArgs.opts());

//process.exit(-1);

var qMgr = cliArgs.queueManager;
var qName = cliArgs.queueName;
console.log("Attempting to send test message...");

//Set the MQ(C)on(N)ection(O)ptions
var cno = new mq.MQCNO(); 
cno.Options = MQC.MQCNO_CLIENT_BINDING; // use MQCNO_CLIENT_BINDING to connect as client

// To add authentication set the MQ(C)onn(S)ecurity(P)arameters
if(cliArgs.user) //Note that even though this isn't referenced must pass it in so that the MQSCP object is created
{
  var csp = new mq.MQCSP(); 
  //using the cliArgs.user and cliArgs.pswd doesn't work...no time to debug
  //hardcoded for now...change if needed
  csp.UserId = "DEV1BTS.SRV"; 
  csp.Password = "Ynot$1234"; 

  cno.SecurityParms = csp;
}
//To set the MQ(C)hannel(D)efinition
var cd = new mq.MQCD();
//Again, hardcoded these for now but with time move this to command line argument
cd.ConnectionName = "NJES1a9303.apps.ci.gc.ca(1665)"; 
cd.ChannelName = "IMUTILITY.SVRCONN";
// Make the MQCNO refer to the MQCD
cno.ClientConn = cd;

mq.Connx(qMgr, cno, function(err,hConn) {
   if (err) {
     console.log(formatErr(err));
   } else {
     console.log("MQCONN to %s successful ", qMgr);

     // Define what we want to open, and how we want to open it.
     var od = new mq.MQOD();
     od.ObjectName = qName;
     od.ObjectType = MQC.MQOT_Q;
     var openOptions = MQC.MQOO_OUTPUT;
     mq.Open(hConn,od,openOptions,function(err,hObj) {
       if (err) {
         console.log(formatErr(err));
       } else {
         console.log("MQOPEN of %s successful",qName);
         putMessage(hObj);
       }
       cleanup(hConn,hObj);
     });
   }
});
