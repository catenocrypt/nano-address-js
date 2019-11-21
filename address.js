module.exports = {
    addressIsValid: addressIsValid,
    addressIsValidNanoPrefix: addressIsValidNanoPrefix,

    seedIsValid: seedIsValid,
    seedFromHex: seedFromHex,
    addressFromByteSeed: addressFromByteSeed,
}

//module.exports = nanoAddress;

//module.exports = {
//  nanoAddressFromByteSeed: nanoAddressFromByteSeed,
//  nanoAddressFromHexSeed: nanoAddressFromHexSeed
//};


const nacl = require('./nacl');
//console.log("nacl", nacl);
const blake = require('blakejs');
//console.log("blake", blake);

//window.nanoAddress = {
//    nanoAddressFromByteSeed: nanoAddressFromByteSeed,
//    nanoAddressFromHexSeed: nanoAddressFromHexSeed
//};

//const blake = window['blake'];
//const nacl = window['nacl'];
//const nacl = window.nacl;


//const mnemonic = require('mnemonic');

//var entrSeed = mnemonic.toRawEntropyHex(paph1);
//const seedBytes = nacl.randomBytes(128)
//nanoAddressFromByteSeed(seedBytes, 0)
//nanoAddressFromByteSeed(seedBytes, 1)

/// Check if as address is a valid NANO address.  Prefix is 'nano_', or legacy 'xrb_'
function addressIsValid(address) {
    if (addressIsValidNanoPrefix(address)) return true;
    if (addressIsValidWithPrefix(address, "xrb_")) return true;
    return false;
}

/// Check if as address is a valid NANO address, with default 'nano_' prefix.
function addressIsValidNanoPrefix(address) {
    return addressIsValidWithPrefix(address, "nano_");
}

/// Check if as address is a valid NANO address, with default 'nano_' prefix.
function addressIsValidWithPrefix(address, prefix) {
    if (!address.length == prefix.length + 60) return false;
    if (address.substr(0, prefix.length) != prefix) return false;
    return true;
}

/// Check is seed (byte array) is valid: its length is 32
function seedIsValid(seed) {
    if (seed.length != 32) return false;
    return true;
}

/// Convert hex string seed to byte array seed
function seedFromHex(seedHex) {
    if (seedHex.length != 64) return [];
    var seedBytes = hexToUint8(seedHex);
    if (!seedIsValid(seedBytes)) return [];
    return seedBytes;
}

/// Derive an account from the seed, of order index (0, 1, 2, ...)
function addressFromByteSeed(seedBytes,  accountIndex) {
    if (!seedIsValid(seedBytes)) return "";
    //console.log("  seedsize", seedBytes.length, "seed", seedBytes);
    const accountBytes = generateAccountSecretKeyBytes(seedBytes,  accountIndex);
    //console.log("accountBytes", accountBytes.length, accountBytes)
    const accKeyPair = generateAccountKeyPair(accountBytes);
    //console.log(accKeyPair.publicKey.length, accKeyPair.secretKey.length, accKeyPair.publicKey, accKeyPair.secretKey);
    const account = getPublicAccountID(accKeyPair.publicKey);
    //console.log(account);
    return {account: account, publicKey: uint8ToHex(accKeyPair.publicKey), privateKey: uint8ToHex(accKeyPair.secretKey)};
}



function generateAccountSecretKeyBytes(seedBytes, accountIndex) {
    const accountIndexBytes = hexToUint8(decToHex(accountIndex, 4));
    const context = blake.blake2bInit(32);
    blake.blake2bUpdate(context, seedBytes);
    blake.blake2bUpdate(context, accountIndexBytes);
    const newKey = blake.blake2bFinal(context);

    return newKey;
}

function generateAccountKeyPair(accountSecretKeyBytes) {
    const kp = nacl.sign.keyPair.fromSecretKey(accountSecretKeyBytes);
    return kp;
}

function getPublicAccountID(accountPublicKeyBytes) {
    const accountHex = uint8ToHex(accountPublicKeyBytes);
    const keyBytes = uint4ToUint8(hexToUint4(accountHex)); // For some reason here we go from u, to hex, to 4, to 8??
    const checksum = uint5ToString(uint4ToUint5(uint8ToUint4(blake.blake2b(keyBytes, null, 5).reverse())));
    const account = uint5ToString(uint4ToUint5(hexToUint4(`0${accountHex}`)));

    return `nano_${account}${checksum}`;
}

function hexToUint8(hexValue) {
    const length = (hexValue.length / 2) | 0;
    const uint8 = new Uint8Array(length);
    for (let i = 0; i < length; i++) uint8[i] = parseInt(hexValue.substr(i * 2, 2), 16);

    return uint8;
}

function decToHex(decValue, bytes = null) {
    var dec = decValue.toString().split(''), sum = [], hex = '', hexArray = [], i, s
    while(dec.length) {
        s = 1 * dec.shift()
        for(i = 0; s || i < sum.length; i++)
        {
            s += (sum[i] || 0) * 10
            sum[i] = s % 16
            s = (s - sum[i]) / 16
        }
    }
    while(sum.length) {
        hexArray.push(sum.pop().toString(16));
    }
    
    hex = hexArray.join('');
    
    if(hex.length % 2 != 0)
        hex = "0" + hex;
    
    if(bytes > hex.length / 2) {
        var diff = bytes - hex.length / 2;
        for(var j = 0; j < diff; j++)
            hex = "00" + hex;
    }
    
    return hex;
}

function uint8ToHex(uintValue) {
    let hex = "";
    let aux;
    for (let i = 0; i < uintValue.length; i++) {
        aux = uintValue[i].toString(16).toUpperCase();
        if(aux.length == 1)
            aux = '0'+aux;
        hex += aux;
        aux = '';
    }
    
    return(hex);
}
    
function uint4ToUint8(uintValue) {
    const length = uintValue.length / 2;
    const uint8 = new Uint8Array(length);
    for (let i = 0; i < length; i++)	uint8[i] = uintValue[i*2] * 16 + uintValue[i*2+1];
    
    return uint8;
}

function uint5ToString(uint5) {
    const letter_list = '13456789abcdefghijkmnopqrstuwxyz'.split('');
    let string = "";
    for (let i = 0; i < uint5.length; i++)	string += letter_list[uint5[i]];
    
    return string;
}

function hexToUint4(hexValue) {
    const uint4 = new Uint8Array(hexValue.length);
    for (let i = 0; i < hexValue.length; i++) uint4[i] = parseInt(hexValue.substr(i, 1), 16);
    
    return uint4;
}

function uint4ToUint5(uintValue) {
    var length = uintValue.length / 5 * 4;
    var uint5 = new Uint8Array(length);
    for (let i = 1; i <= length; i++) {
        let n = i - 1;
        let m = i % 4;
        let z = n + ((i - m)/4);
        let right = uintValue[z] << m;
        let left;
        if (((length - i) % 4) == 0)  left = uintValue[z-1] << 4;
        else  left = uintValue[z+1] >> (4 - m);
        uint5[n] = (left + right) % 32;
    }
    return uint5;
}
    
function uint8ToUint4(uintValue) {
    const uint4 = new Uint8Array(uintValue.length * 2);
    for (let i = 0; i < uintValue.length; i++) {
        uint4[i*2] = uintValue[i] / 16 | 0;
        uint4[i*2+1] = uintValue[i] % 16;
    }
    
    return uint4;
}
    
function uint4ToUint5(uintValue) {
    var length = uintValue.length / 5 * 4;
    var uint5 = new Uint8Array(length);
    for (let i = 1; i <= length; i++) {
        let n = i - 1;
        let m = i % 4;
        let z = n + ((i - m)/4);
        let right = uintValue[z] << m;
        let left;
        if (((length - i) % 4) == 0)  left = uintValue[z-1] << 4;
        else  left = uintValue[z+1] >> (4 - m);
        uint5[n] = (left + right) % 32;
    }
    return uint5;
}
    
function hexToUint4(hexValue) {
    const uint4 = new Uint8Array(hexValue.length);
    for (let i = 0; i < hexValue.length; i++) uint4[i] = parseInt(hexValue.substr(i, 1), 16);
    
    return uint4;
}
