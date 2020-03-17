package com.archil.components

import org.springframework.stereotype.Component
import java.util.concurrent.ConcurrentHashMap
import javax.swing.text.StyledEditorKit

@Component
class AppState {
    private var _isLergImportInProgress = false

    var isLergImportInProgress: Boolean
        get() {
            synchronized(this) {
                return _isLergImportInProgress
            }
        }
        set(value) {
            synchronized(this) {
                _isLergImportInProgress = value
            }
        }

    private val rateDeckInProgressMap = ConcurrentHashMap<Long, Long>()

    fun isRateDeckInProgress(userId: Long): Boolean {
        return rateDeckInProgressMap[userId] != null
    }

    fun setRateDeckInProgress(userId: Long, value: Boolean) {
        synchronized(rateDeckInProgressMap) {
            val ref = (rateDeckInProgressMap[userId] ?: 0L) + (if (value) 1L else -1L)
            if (ref > 0) {
                rateDeckInProgressMap[userId] = ref
            } else {
                rateDeckInProgressMap.remove(userId)
            }
        }
    }

    private val cdrImportInProgressMap = ConcurrentHashMap<Long, Long>()

    fun isCdrImportInProgress(userId: Long): Boolean {
        return cdrImportInProgressMap[userId] != null
    }

    fun setCdrImportInProgress(userId: Long, value: Boolean) {
        synchronized(cdrImportInProgressMap) {
            val ref = (cdrImportInProgressMap[userId] ?: 0L) + (if (value) 1L else -1L)
            if (ref > 0) {
                cdrImportInProgressMap[userId] = ref
            } else {
                cdrImportInProgressMap.remove(userId)
            }
        }
    }

    private val cdrDipInProgressMap = ConcurrentHashMap<Long, Long>()

    fun isCdrDipInProgress(userId: Long): Boolean {
        return cdrDipInProgressMap[userId] != null
    }

    fun setCdrDipInProgress(userId: Long, value: Boolean) {
        synchronized(cdrDipInProgressMap) {
            val ref = (cdrDipInProgressMap[userId] ?: 0L) + (if (value) 1L else -1L)
            if (ref > 0) {
                cdrDipInProgressMap[userId] = ref
            } else {
                cdrDipInProgressMap.remove(userId)
            }
        }
    }

    private val lataNpanxxReport1InProgressMap = ConcurrentHashMap<Long, Long>()

    fun isLataNpanxxReport1InProgress(userId: Long): Boolean {
        return lataNpanxxReport1InProgressMap[userId] != null
    }

    fun setLataNpanxxReport1InProgress(userId: Long, value: Boolean) {
        synchronized(lataNpanxxReport1InProgressMap) {
            val ref = (lataNpanxxReport1InProgressMap[userId] ?: 0L) + (if (value) 1L else -1L)
            if (ref > 0) {
                lataNpanxxReport1InProgressMap[userId] = ref
            } else {
                lataNpanxxReport1InProgressMap.remove(userId)
            }
        }
    }

    private var _isLrnRefreshInProgress = false
    var isLrnRefreshInProgress: Boolean
        get() {
            synchronized(this) {
                return _isLrnRefreshInProgress
            }
        }
        set(value) {
            synchronized(this) {
                _isLrnRefreshInProgress = value
            }
        }
}