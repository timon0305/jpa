package com.digitalipvoice.cps.somos.proxy

import org.apache.logging.log4j.LogManager
import java.io.FileInputStream
import java.lang.management.ManagementFactory
import java.util.*

fun <T> proxyLogger(clazz:Class<T>) = LogManager.getLogger(clazz)

class ProxyApplication {
    var proxyClients = listOf<ProxyServerClient>()
    var proxyServers = listOf<ProxyServer>()
    fun run(){
        val props = Properties()
        props.load(FileInputStream("proxy-settings.properties"))

        val serverAddress = props.getProperty("serverAddress")
        val serverPorts = props.getProperty("serverPorts").split(",").map{it.toInt()}
        val destNodeNames = props.getProperty("destNodeNames").split(",")
        var srcNodeNames = props.getProperty("srcNodeNames").split(",")

        val proxyPorts = props.getProperty("proxyPort")
        val bindAddress = props.getProperty("bindAddress")

        // One proxy server client and proxy servers for proxy port
        proxyClients = (0 until serverPorts.size).map{index ->
            ProxyServerClient(serverAddress, serverPorts[index], srcNodeNames[index], destNodeNames[index])
        }

        // Create ProxyServer instances
        proxyServers = proxyPorts.split(",").map{it.toInt()}.map {
            ProxyServer(bindAddress, it).apply {
                clientMessageForward = {
                    proxyClients[0].send(it)
                    /*
                    // pick random active client
                    val index = Random().nextInt(proxyClients.count())
                    if (index >= 0 && proxyClients.isNotEmpty()) {
                        proxyClients[index].send(it)
                    }
                    */
                }
            }
        }

        // Pick random proxy client and send message over there
        proxyClients.forEach{c ->
            c.serverMessageForward = { m ->
                val activeServers = proxyServers.filter { it.hasActiveConnections }
                val index = Random().nextInt(activeServers.size)
                if (index >= 0 && activeServers.isNotEmpty()) {
                    activeServers[index].send(m)
                }
            }
        }

        // Start connections
        proxyServers.forEach{it.start()}
        proxyClients.forEach{it.connect()}
    }
}

fun main(args:Array<String>) {
    /**
     * Configurate loggers
     */
    val pid = getPid()
    val logger = proxyLogger(ProxyApplication::class.java)
    logger.info("Started running on $pid")

    ProxyApplication().run()
}

private fun getPid() = ManagementFactory.getRuntimeMXBean().name.split("@")[0]