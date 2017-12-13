var pm2 = require('pm2');

module.exports = function(RED) {
    function pm2Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function(msg) {
            pm2.connect(function(err) {
                if (err) {
                    node.error(err);
                    return;
                }

                if (typeof msg.payload === 'string' || msg.payload instanceof String) {
                    if (msg.payload === 'list') {
                        pm2.list(function(err, processDescriptionList) {
                            if (err) {
                                node.error('PM2: ' + err);
                                return;
                            }
                            msg.payload = processDescriptionList;
                            node.send(msg);
                            pm2.disconnect();
                        });
                    }
                    if (msg.payload.startsWith('start')) {
                        var start_proc = msg.payload.split(' ')[1];
                        pm2.start(start_proc, function(err) {
                            if (err) {
                                node.error('PM2: ' + err);
                            }
                            pm2.disconnect();
                        });
                    }
                    if (msg.payload.startsWith('stop')) {
                        var stop_proc = msg.payload.split(' ')[1];
                        pm2.stop(stop_proc, function(err) {
                            if (err) {
                                node.error('PM2: ' + err);
                            }
                            pm2.disconnect();
                        });
                    }
                    if (msg.payload.startsWith('restart')) {
                        var restart_proc = msg.payload.split(' ')[1];
                        pm2.restart(restart_proc, function(err) {
                            if (err) {
                                node.error('PM2: ' + err);
                            }
                            pm2.disconnect();
                        });
                    }
                } else {
                    node.error("Payload must be a string", msg);
                }
            });
        });
    }
    RED.nodes.registerType("pm2-node", pm2Node);
};
