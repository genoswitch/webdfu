/**
 * DFU Upload and Download requests require a block number.
 *
 * This is a number between `0` and `65,535` which increments each time a (new) block is transferred.
 * If the number reaches it's maximum value, it overflows to zero.
 *
 */
export type BlockNumber = number;
