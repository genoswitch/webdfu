import * as React from "react";

import { Chip } from "@mui/material";

import { DFUDevice, DFUVersion } from "dfu";

type DFUVersionChipProps = {
    dfuDevice: DFUDevice
}

const DFUVersionChip = ({ dfuDevice }: DFUVersionChipProps): React.JSX.Element => {
    switch (dfuDevice.type) {
        // DFU 1.0
        default:
            return <span style={{ paddingRight: 16 }}>
                <Chip label="DFU 1.0" />
            </span>
        case (DFUVersion.DFU_1_1 || DFUVersion.DFU_1_1_ALT):
            return <span style={{ paddingRight: 16 }}>
                <Chip label="DFU 1.0" />
            </span>
        case DFUVersion.DfuSe:
            return <span style={{ paddingRight: 16 }}>
                <Chip label="DfuSe" />
            </span>


    }
};

export default DFUVersionChip;