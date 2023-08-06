import * as React from "react";

import { Button } from "@mui/material";

import { DeviceBootstrapper, DFUDevice } from "dfu";

import DeviceCard from "../components/deviceCard";
import DownloadCard from "../components/downloadCard";

export default class Demo extends React.Component {

    device: USBDevice | undefined;
    dfuDevice: DFUDevice | undefined;


    async handleConnect(): Promise<void> {
        const device = await navigator.usb.requestDevice({ filters: [] }).catch(err => {
            console.error(err);
        })

        if (device) {
            const bootstrapper = new DeviceBootstrapper(device);

            this.device = device;

            this.dfuDevice = await bootstrapper.init();

            this.forceUpdate();
        }

    }

    async handleDisconnect(): Promise<void> {
        if (this.dfuDevice) {
            await this.dfuDevice.close();
            this.dfuDevice = undefined;
        } else {
            console.warn("Attempted to close a non-exsistent DFUDevice.")
        }
        this.forceUpdate();
    }

    render(): React.JSX.Element {
        // use typeof to check if navigator is available for gatsby
        // https://github.com/twilio/twilio-video.js/issues/997
        if (typeof navigator !== 'undefined') {
            if (navigator.usb) {
                return (
                    <>
                        {this.dfuDevice == undefined ? <Button variant="outlined" onClick={() => this.handleConnect()}>Connect</Button> : <Button variant="contained" onClick={() => this.handleDisconnect()}>Disconnect</Button>}
                        <DeviceCard device={this.device} dfuDevice={this.dfuDevice} />
                        <DownloadCard device={this.device} dfuDevice={this.dfuDevice} />
                    </>
                )
            } else {
                return (<>WebUSB is not supported.</>)
            }
        } else {
            return (<>Navigator is not available.</>)
        }

    }
}