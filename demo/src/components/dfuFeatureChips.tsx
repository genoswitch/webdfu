import * as React from "react";

import { DFUDevice } from "../../../src/dfu";
import { Chip } from "@mui/material";

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DFUFunctionalDescriptorAttribute } from "../../../src/protocol/dfu/functionalDescriptorAttribute";


type FeatureChipProps = {
    title: string,
    isSupported: DFUFunctionalDescriptorAttribute
}
const FeatureChip = ({ title, isSupported }: FeatureChipProps): React.JSX.Element => {
    if (isSupported) {
        return <span style={{ paddingRight: 16 }}>
            <Chip icon={<CheckCircleIcon />} label={title} color="success" />
        </span>
    } else {
        return <span style={{ paddingRight: 16 }}>
            <Chip icon={<CancelIcon />} label={title} color="error" />
        </span>
    }
}

type DFUFeatureChipsProps = {
    dfuDevice: DFUDevice;
}

const DFUFeatureChips = ({ dfuDevice }: DFUFeatureChipsProps): React.JSX.Element => {
    return (
        <>
            <FeatureChip title="Download" isSupported={dfuDevice.attributes.CAN_DOWNLOAD} />
            <FeatureChip title="Upload" isSupported={dfuDevice.attributes.CAN_UPLOAD} />
            <FeatureChip title="Manifestation Tolerant" isSupported={dfuDevice.attributes.MANIFESTATION_TOLERANT} />
            <FeatureChip title="Detach" isSupported={dfuDevice.attributes.WILL_DETACH} />
        </>
    )
}

export default DFUFeatureChips;