import * as React from "react";

import { Button, Card, CardContent, Typography } from "@mui/material";

import { DeviceBootstrapper } from "dfu";
import { DFUDevice } from "../../../src/dfu";
import DeviceCard from "../components/deviceCard";

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
        if (navigator.usb) {
            return (
                <>
                    {this.dfuDevice == undefined ? <Button variant="outlined" onClick={() => this.handleConnect()}>Connect</Button> : <Button variant="contained" onClick={() => this.handleDisconnect()}>Disconnect</Button>}
                    <DeviceCard device={this.device} dfuDevice={this.dfuDevice} />
                </>
            )
        } else {
            return (<>WebUSB is not supported.</>)
        }

    }
}