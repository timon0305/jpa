package com.digitalipvoice.cps.components

import com.digitalipvoice.cps.model.Admin2SomosCommands
import com.digitalipvoice.cps.persistance.dao.SMSConnectionRepository
import com.digitalipvoice.cps.utils.logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.event.ApplicationStartedEvent
import org.springframework.context.ApplicationListener
import org.springframework.stereotype.Component
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress

@Component
class Bootstrap: ApplicationListener<ApplicationStartedEvent> {
    @Autowired
    lateinit var connectionsManager: SMSConnectionManager

    @Value("\${udp.server.port}")
    private var udpPort: Int = 0

    private val log = logger(javaClass)

    override fun onApplicationEvent(evt: ApplicationStartedEvent) {
        log.debug("Application Started : Starting MGI Connections")
        connectionsManager.startConnections()

        // Create UDP Listener thread that starts/stop somos connections.
        createUDPThread()
    }


    fun createUDPThread(){
        Thread{
            val socket = DatagramSocket(udpPort, InetAddress.getLoopbackAddress())
            while(true){
                val buf = ByteArray(100)
                val packet = DatagramPacket(buf, buf.size)
                socket.receive(packet)

                val command = String(packet.data, 0, packet.length)
                if (command == Admin2SomosCommands.start) {
                    connectionsManager.restartConnections()
                } else if (command == Admin2SomosCommands.stop){
                    connectionsManager.stopConnections()
                }
            }
        }.run()
    }
}