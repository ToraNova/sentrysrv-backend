#!/bin/sh
HID=$1
BRANCH=$2
ENUM=$3

[ -z "$1" ] && echo "Please specify host number. (arg1)" && exit 1;
[ -z "$2" ] && echo "Please specify branch number. (arg2)" && exit 1;
[ -z "$3" ] && echo "Please specify element number. (arg3)" && exit 1;

ATYPE=1
ADET='test-sensor'
USER='cjason'
PASS='test123'
#$BHOST='192.168.40.119'
BHOST='localhost'
TOPIC='alert'

MSG="{\"id\":\"$HID\",\"type\":\"$ATYPE\",\"details\":\"$ADET\",\"branch\":\"$BRANCH\",\"enum\":$ENUM}"
# quick mosquitto pub script
echo "mosquitto_pub -h $BHOST -u $USER -P $PASS -t $TOPIC -m $MSG"
mosquitto_pub -h $BHOST -u $USER -P $PASS -t $TOPIC -m $MSG
