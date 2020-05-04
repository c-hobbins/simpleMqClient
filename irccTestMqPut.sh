#!/bin/bash 

#For some reason passing the user/pswd in the commandline is not accepted...will leave for now and 
#if you need to change these you will have to modify the sendMsg.js file
#and update these values and then re-execute this.
#**Note that even though these -u and -p are not used they still trigger the use of the MQSCP in the send**


node sendMsg.js -qm DEVIRCC -q WPO.EAPPS.TO.BTS.REQUEST.N1 -u DEV1BTS.SRV -p Ynot$1234