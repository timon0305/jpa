package com.digitalipvoice.cps

// Constants
/**
 * Based on structure of MgiMessage Data Structure, Define LengthFieldBasedFrameDecoder parameters
 * MD FLAG AND SIZE (8 bytes)
 * Encapsulated Application Data
 */

const val MAX_FRAME_LENGTH = 2147483647
const val LENGTH_FIELD_LENGTH = 4         // LENGTH FILED is 4 bytes
const val LENGTH_FIELD_OFFSET = 4         // LENGTH FIELD offset if 4 (First 4 byte is MD)
const val LENGTH_ADJUSTMENT = 0           //
const val INITIAL_BYTES_TO_STRIP = 8      // 8 Byte should be read first

/**
 * SOCKET IDLE CONFIGURATION
 */
const val READ_IDLE_TIME_OUT = 240L     // 4 minutes
const val WRITE_IDLE_TIME_OUT = 240L
const val ALL_IDLE_TIME_OUT = 240L

/**
 * Try Reconnect time out
 */
const val SOMOS_RECONNECT_INTERVAL = 5