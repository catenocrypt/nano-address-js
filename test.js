console.log("Nano Address Sample/Test");
console.log("");

var nanoAddress = require('./address');
//console.log("nanoAddress", nanoAddress);

/*
Sample test data

6B2B09F6385E16D30ABABB83A43A3EF4342CAE61C57BD66CD7FA0A4C48CD4E1E
hen flame laugh idle thumb hat cliff first lonely canyon moral trick drift fire mandate quarter stool grit write behind setup grit debris swamp
nano_1s6gkttpzjzphu87xr8qkox1phng4br8jr7w9xsexzmnouddfwkc7nff67wd
nano_3zf7fgzk8uz8zb8o5hxu5d9xfi7ratufwxxk65jupahcycoy8r3jzgra8fju
nano_1as5zrrpo8chn3h5bndkyukw1k4pk3dq6xz5169ntfxi94a15eicbezmqg9k

37BF493A663189E85048521F47C82DF6B87B12FF7CAA51B41AD0739E588290A6
dash where excess small blush vintage donkey apart butter dinner arena uniform marble maximum worth next faculty patch reduce transfer tortoise donor dream suspect
nano_1j4gjsydje9f1b8zgox9toszge6qbs9pyq8gu7c5ccyk5d9xpbijoh5tniqi
nano_1ohiptkq4spz47bk9w89w6ckyeq8tst6tw7f33atej1a8xzxiew9cbsuzjb3
nano_3n37pq5bz4xgqpbdx744w5noxzf1dsd8higxq5apb37xaiqpp73dh553eukm
*/

var seedHex1 = "6B2B09F6385E16D30ABABB83A43A3EF4342CAE61C57BD66CD7FA0A4C48CD4E1E";
var seed1 = nanoAddress.seedFromHex(seedHex1);

if (!nanoAddress.seedIsValid(seed1)) fail("Invalid seed");

var addr0 = nanoAddress.addressFromByteSeed(seed1, 0);
console.log("addr #0:", addr0.account);
if (!nanoAddress.addressIsValidNanoPrefix(addr0.account)) fail("Invalid address");
if (addr0.account != "nano_1s6gkttpzjzphu87xr8qkox1phng4br8jr7w9xsexzmnouddfwkc7nff67wd") {
    fail("addr0 mismatch");
}

var addr1 = nanoAddress.addressFromByteSeed(seed1, 1);
console.log("addr #1:", addr1.account);
if (!nanoAddress.addressIsValidNanoPrefix(addr1.account)) fail("Invalid address");
if (addr1.account != "nano_3zf7fgzk8uz8zb8o5hxu5d9xfi7ratufwxxk65jupahcycoy8r3jzgra8fju") {
    fail("addr1 mismatch");
}

var addr2 = nanoAddress.addressFromByteSeed(seed1, 2);
console.log("addr #2:", addr2.account);
if (!nanoAddress.addressIsValidNanoPrefix(addr2.account)) fail("Invalid address");
if (addr2.account != "nano_1as5zrrpo8chn3h5bndkyukw1k4pk3dq6xz5169ntfxi94a15eicbezmqg9k") {
    fail("addr2 mismatch");
}

var seedHex2 = "37BF493A663189E85048521F47C82DF6B87B12FF7CAA51B41AD0739E588290A6";
var seed2 = nanoAddress.seedFromHex(seedHex2);

if (!nanoAddress.seedIsValid(seed2)) fail("Invalid seed");

var addr2_0 = nanoAddress.addressFromByteSeed(seed2, 0);
console.log("addr #0:", addr2_0.account);
if (!nanoAddress.addressIsValidNanoPrefix(addr2_0.account)) fail("Invalid address");
if (addr2_0.account != "nano_1j4gjsydje9f1b8zgox9toszge6qbs9pyq8gu7c5ccyk5d9xpbijoh5tniqi") {
    fail("addr2_0 mismatch");
}

function fail(message) {
    console.log("ERROR:", message);
    process.exit(-1);
}
