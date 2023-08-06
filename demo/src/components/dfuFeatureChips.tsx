import * as React from "react";

import { DFUDevice } from "../../../src/dfu";
import { Chip } from "@mui/material";

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { DFUFunctionalDescriptorAttribute } from "dfu";


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
    console.log(dfuDevice.attributes)
    return (
        <>
            <FeatureChip title="Download" isSupported={dfuDevice.functionalDescriptor.isSupported(DFUFunctionalDescriptorAttribute.CAN_DOWNLOAD)} />
            <FeatureChip title="Upload" isSupported={dfuDevice.functionalDescriptor.isSupported(DFUFunctionalDescriptorAttribute.CAN_UPLOAD)} />
            <FeatureChip title="Manifestation Tolerant" isSupported={dfuDevice.functionalDescriptor.isSupported(DFUFunctionalDescriptorAttribute.MANIFESTATION_TOLERANT)} />
            <FeatureChip title="Detach" isSupported={dfuDevice.functionalDescriptor.isSupported(DFUFunctionalDescriptorAttribute.WILL_DETACH)} />
        </>
    )
}

export default DFUFeatureChips;