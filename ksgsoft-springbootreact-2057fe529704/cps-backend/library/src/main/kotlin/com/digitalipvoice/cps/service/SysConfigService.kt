package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.persistance.dao.SysConfigRepository
import com.digitalipvoice.cps.utils.logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class SysConfigService {
    val log = logger(javaClass)

    @Autowired
    private lateinit var sysConfigRepository: SysConfigRepository
}