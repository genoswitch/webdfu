import * as React from "react";

import { Card, CardContent, Typography } from "@mui/material";

import { DFUDevice } from "../../../src/dfu";

import DFUVersionChip from "../components/dfuVersionChip";
import DFUFeatureChips from "../components/dfuFeatureChips";



type DeviceCardProps = {
    device: USBDevice
    dfuDevice: DFUDevice
}

const DeviceCard = ({ device, dfuDevice }: DeviceCardProps): React.JSX.Element => {
    if (device && dfuDevice) {
        return (
            <Card variant="outlined">
                <CardContent>
                    <Typography color="text.secondary">
                        {device.manufacturerName}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {device.productName}
                    </Typography>
                    <Typography color="text.secondary">
                        Serial: {device.serialNumber}
                    </Typography>
                    {/** Capabilities */}
                    <br />
                    <DFUVersionChip dfuDevice={dfuDevice} />
                    <DFUFeatureChips dfuDevice={dfuDevice} />
                </CardContent>

            </Card>
        )
    }
}

export default DeviceCard;