import * as React from "react";

import { Button, Card, CardContent, LinearProgress, TextField, Typography } from "@mui/material";
import { MuiFileInput } from 'mui-file-input'

import { DFUDevice } from "../../../src/dfu";


type DownloadCardProps = {
    device: USBDevice,
    dfuDevice: DFUDevice
}

const DownloadCard = ({ device, dfuDevice }: DownloadCardProps) => {
    if (device && dfuDevice) {
        const [file, setFile] = React.useState(null as unknown as File)
        const [progress, setProgress] = React.useState(NaN);
        const [done, setIsDone] = React.useState(false);

        const handleChange = (newFile) => {
            setFile(newFile)
        }

        const handleButtonClick = async () => {
            const events = dfuDevice.beginWrite(await file.arrayBuffer())

            events.on("write/start", () => {
                setIsDone(false);
                setProgress(0);
            })
            events.on("write/progress", (bytesSent, expectedSize) => {
                setProgress((bytesSent / expectedSize) * 100)
            })

            events.on("write/finish", () => {
                setProgress(100);
                setIsDone(true);
            })
        }

        return (
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" component="div">
                        Firmware Download (to USB device)
                    </Typography>
                    {/** TextField Props: see https://mui.com/material-ui/react-text-field/#type-quot-number-quot */}
                    <div style={{ paddingTop: 16, paddingBottom: 16 }}>
                        <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} label="Transfer Size" variant="outlined" defaultValue={64} />
                    </div>
                    <div style={{ paddingTop: 16, paddingBottom: 16 }}>
                        <MuiFileInput value={file} onChange={handleChange} placeholder="Upload a file..." />
                    </div>
                    <Button onClick={handleButtonClick} disabled={file == undefined}>Upload</Button>
                    <div style={{ paddingTop: 16, paddingBottom: 16 }}>
                        <LinearProgress variant="determinate" disabled={isNaN(progress) || done} value={isNaN(progress) ? 0 : progress} />
                    </div>
                    {done ?
                        <>
                            <Typography>
                                Download completed successfully.
                            </Typography>
                        </>
                        : undefined}
                </CardContent>
            </Card>
        )
    }
}
export default DownloadCard;