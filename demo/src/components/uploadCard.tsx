import * as React from "react";

import { Button, Card, CardContent, LinearProgress, Typography } from "@mui/material";

import { DFUDevice } from "dfu";

import { saveAs } from 'file-saver';


type UploadCardProps = {
    device: USBDevice,
    dfuDevice: DFUDevice
}

const UploadCard = ({ device, dfuDevice }: UploadCardProps) => {
    if (device && dfuDevice) {
        // https://typeofnan.dev/why-you-cant-setstate-multiple-times-in-a-row/
        const [state, setState] = React.useState({ inProgress: false, progress: 0, isDone: false });

        const handleButtonClick = () => {
            const events = dfuDevice.beginRead();

            setState({ ...state, inProgress: true })

            //events.on("read/start", () => {
            //    setState({ ...state, inProgress: true })
            //})

            events.on("read/finish", (bytesRead, blocks, data) => {
                setState({ inProgress: false, progress: 100, isDone: true })

                // Trigger a download for the data blob.
                saveAs(data, "firmware.bin")

            })
        }

        return (
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" component="div">
                        Firmware Upload (from USB device)
                    </Typography>
                    <Button onClick={handleButtonClick}>Upload</Button>
                    <div style={{ paddingTop: 16, paddingBottom: 16 }}>
                        {state.inProgress ? <LinearProgress /> : <LinearProgress variant="determinate" value={state.progress} />}
                    </div>
                    {state.isDone ?
                        <>
                            <Typography>
                                Upload completed successfully.
                            </Typography>
                        </>
                        : undefined}
                </CardContent>
            </Card>
        )
    }
}

export default UploadCard;