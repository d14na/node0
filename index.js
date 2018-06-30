#!/usr/bin/env node

const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Are you looking for ZeroNet?'))

app.get('/:path', (req, res) => res.send('Are you looking for ZeroNet?'))

app.listen(43110, () => console.log('Listening on ZeroNet default [43110]'))


_announce() {
    /* Localize this. */
    const self = this

    console.log('Announcing...')

    const Client = require('zeronet-tracker')

    const crypto = require('crypto')
    let shasum = crypto.createHash('sha1')
    shasum.update('1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D')
    const infoHash = shasum.digest('hex')
    console.log('Info hash', infoHash)

    var requiredOpts = {
        infoHash,
        // infoHash: Buffer.from('1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D'),
        // infoHash: Buffer.from('37826C0C2ECC81F06B39C124DDA88E00E9D559D1'),
        peerId: this.state.peerId,
        announce: [
            // 'udp://tracker.coppersurfer.tk:6969',
            'udp://tracker.leechers-paradise.org:6969'
        ],
        port: 6881
    }

    // var optionalOpts = {
    //     getAnnounceOpts: function () {
    //         // Provide a callback that will be called whenever announce() is called
    //         // internally (on timer), or by the user
    //         return {
    //             uploaded: 0,
    //             downloaded: 0,
    //             left: 0,
    //             customParam: 'blah' // custom parameters supported
    //         }
    //     },
    //
    //     // RTCPeerConnection config object (only used in browser)
    //     rtcConfig: {},
    //
    //     // User-Agent header for http requests
    //     userAgent: '',
    //
    //     // Custom webrtc impl, useful in node to specify [wrtc](https://npmjs.com/package/wrtc)
    //     wrtc: {},
    // }

    var client = new Client(requiredOpts)

    client.on('error', function (err) {
        // fatal client error!
        console.log(err.message)
    })

    client.on('warning', function (err) {
        // a tracker was unavailable or sent bad data to the client. you can probably ignore it
        console.log(err.message)
    })

    // start getting peers from the tracker
    client.start()

    client.on('update', function (data) {
        console.log('got an announce response from tracker: ', data.announce)
        console.log('number of seeders vs. leechers in the swarm: ', data.complete, data.incomplete)
    })

    client.once('peer', function (_address) {
        console.log('found a peer: ' + _address) // 85.10.239.191:48623

        const ipAddress = _address.split(':')[0]
        const port = _address.split(':')[1]

        const peer = { ipAddress, port }

        self.hostIp = ipAddress
        self.hostPort = port

        self._addPeerToDb(infoHash, peer)
    })

    // announce that download has completed (and you are now a seeder)
    // client.complete()

    // force a tracker announce. will trigger more 'update' events and maybe more 'peer' events
    // client.update()

    // provide parameters to the tracker
    // client.update({
    //     uploaded: 0,
    //     downloaded: 0,
    //     left: 0,
    //     customParam: 'blah' // custom parameters supported
    // })

    // stop getting peers from the tracker, gracefully leave the swarm
    // client.stop()

    // ungracefully leave the swarm (without sending final 'stop' message)
    // client.destroy()

    // scrape
    client.scrape()

    client.on('scrape', function (data) {
        console.log('got a scrape response from tracker: ', data.announce)
        console.log('number of seeders vs. leechers in the swarm: ', data.complete, data.incomplete)
        // console.log('number of total downloads of this torrent: ', data.downloaded)
    })
}

// _initPeer() {
//     /* Localize this. */
//     const self = this
//
//     /* Initialize netcat client module. */
//     const NetcatClient = require('netcat/client')
//     this.client = new NetcatClient()
//
//     /* Initialize peer id. */
//     const peerId = '-UT3530-FFFFFFFFFFFF'
//     // const peerid = require('peerid')
//     // this.peerId = peerid()
//
//     this.client.on('connect', function () {
//         console.info('Connection opened.')
//
//         /* Create encoded package. */
//         const pkg = self._encode(self._handshakePkg)
//
//         /* Send the handshake. */
//         self.client.write(pkg, function () {
//             console.log('Sent handshake.')
//             // console.log('sent handshake', pkg)
//         })
//     })
//
//     this.client.on('close', function () {
//         console.info('Connection closed.')
//     })
//
//     this.client.on('error', function (err) {
//         console.error('Error detected', err)
//     })
//
//     // const parser = require('./ZeroNet/handleIncomingData').default
//     this.client.on('data', function (data) {
//         self.setState({ debug: data })
//         // parser(self, data)
//     })
// }

// _announce() {
//     /* Localize this. */
//     const self = this
//
//     // console.log('Announcing...')
//     this.setState({ debug: 'Announcing...' })
//
//     const Client = require('zeronet-tracker')
//
//     const crypto = require('crypto')
//     // const SHA = require('crypto-js/sha1')
//     // console.log(SHA256("Message"))
//
//     let shasum = crypto.createHash('sha1')
//     shasum.update('1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D')
//     // const infoHash = SHA('1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D')
//     const infoHash = shasum.digest('hex')
//     console.log('Info hash', infoHash)
//     this.setState({ debug: infoHash })
//
//     // return
//
//     /* Initialize peer id. */
//     const peerId = '-UT3530-FFFFFFFFFFFF'
//
//     /* Initialize announce. */
//     const announce = [
//         // 'udp://tracker.coppersurfer.tk:6969',
//         'udp://tracker.leechers-paradise.org:6969'
//     ]
//
//     /* Initialize client port. */
//     const port = 6881
//
//     var requiredOpts = {
//         infoHash,
//         peerId,
//         announce,
//         port
//     }
//
//     // var optionalOpts = {
//     //     getAnnounceOpts: function () {
//     //         // Provide a callback that will be called whenever announce() is called
//     //         // internally (on timer), or by the user
//     //         return {
//     //             uploaded: 0,
//     //             downloaded: 0,
//     //             left: 0,
//     //             customParam: 'blah' // custom parameters supported
//     //         }
//     //     },
//     //
//     //     // RTCPeerConnection config object (only used in browser)
//     //     rtcConfig: {},
//     //
//     //     // User-Agent header for http requests
//     //     userAgent: '',
//     //
//     //     // Custom webrtc impl, useful in node to specify [wrtc](https://npmjs.com/package/wrtc)
//     //     wrtc: {},
//     // }
//
//     const client = new Client(requiredOpts)
//
//     client.on('error', function (err) {
//         // fatal client error!
//         console.log(err.message)
//         return self.setState({ debug: err.message })
//     })
//
//     client.on('warning', function (err) {
//         // a tracker was unavailable or sent bad data to the client. you can probably ignore it
//         console.log(err.message)
//         return self.setState({ debug: err.message })
//     })
//
//     // start getting peers from the tracker
//     client.start()
//
//     client.on('update', function (data) {
//         console.log('got an announce response from tracker: ', data.announce)
//         console.log('number of seeders vs. leechers in the swarm: ', data.complete, data.incomplete)
//         return self.setState({ debug: 'number of seeders vs. leechers in the swarm: ' + data.complete + ' / ' + data.incomplete })
//     })
//
//     client.once('peer', function (_address) {
//         return self.setState({ debug: _address })
//
//         console.log('found a peer: ' + _address) // 85.10.239.191:48623
//
//         const ipAddress = _address.split(':')[0]
//         const port = _address.split(':')[1]
//
//         const peer = { ipAddress, port }
//
//         self.hostIp = ipAddress
//         self.hostPort = port
//
//         self._addPeerToDb(infoHash, peer)
//     })
//
//     // announce that download has completed (and you are now a seeder)
//     // client.complete()
//
//     // force a tracker announce. will trigger more 'update' events and maybe more 'peer' events
//     // client.update()
//
//     // provide parameters to the tracker
//     // client.update({
//     //     uploaded: 0,
//     //     downloaded: 0,
//     //     left: 0,
//     //     customParam: 'blah' // custom parameters supported
//     // })
//
//     // stop getting peers from the tracker, gracefully leave the swarm
//     // client.stop()
//
//     // ungracefully leave the swarm (without sending final 'stop' message)
//     // client.destroy()
//
//     // scrape
//     // client.scrape()
//
//     // client.on('scrape', function (data) {
//     //     console.log('got a scrape response from tracker: ', data.announce)
//     //     console.log('number of seeders vs. leechers in the swarm: ', data.complete, data.incomplete)
//     //     // console.log('number of total downloads of this torrent: ', data.downloaded)
//     // })
// }
