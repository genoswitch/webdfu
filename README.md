# WebDFU

[![NPM package](https://img.shields.io/npm/v/dfu)](https://www.npmjs.com/package/dfu)
[![CI in main branch](https://github.com/Flipper-Zero/webdfu/actions/workflows/main.yml/badge.svg)](https://github.com/Flipper-Zero/webdfu/actions/workflows/main.yml)

WebDFU — driver for working with DFU and DfuseDriver in a browser over [Web USB](https://wicg.github.io/webusb/) or [Web Bluetooth](https://webbluetoothcg.github.io/web-bluetooth/).

- Reading and writing the current device firmware by [DFU 1.1](https://www.usb.org/sites/default/files/DFU_1.1.pdf)
- [ST DfuSe](http://dfu-util.sourceforge.net/dfuse.html) download and upload firmware
- Switching from the runtime configuration to the DFU bootloader (DFU detach)

## Install

```shell
npm i dfu
```

## Usage

Full example in: [webdfu/demo](https://github.com/genoswitch/webdfu/tree/main/demo)

Basic example:

````typescript
import { DeviceBootstrapper } from "dfu";


const connect = async () => {
    const device = await navigator.usb.requestDevice({ filters: [] });

    const bootstrapper = new DeviceBootstrapper(device);

    const dfuDevice = await bootstrapper.init();

    //  Read firmware from devie
    const readEvents = dfuDevice.beginRead();
    readEvents.on("read/finish", (bytesRead, blocks, data) => {
        // save the data (blob)
        console.log("Successfully read firmware from device")
    })

    // Write firmware to device
    const firmwareFile = new ArrayBuffer(1024);
    const writeEvents = dfuDevice.beginWrite(firmwareFile);

    writeEvents.on("write/finish", (bytesSent) => {
        console.log("Sucessfully written new firmware to device.")
    })
}

/*
  The browser's security policy requires that WebUSB be accessed only by an explicit user action.
  Add the button in your html and run the WebDFu after click in button.
  In HTML: <button id="connect-button">Connect</button>
*/
document.getElementById("connect-button").addEventListener("click", connect);```
````
