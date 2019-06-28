module.exports = function (RED) {
    function OdooXMLRPCUnlinkNode(config) {
        RED.nodes.createNode(this, config);
        this.host = RED.nodes.getNode(config.host);
        var node = this;

        const handle_error = (err) => {
            console.log(err);
            this.status({fill: "red", shape: "dot", text: err.message});
            this.error(err.message);
        };

        node.on('input', (msg) => {
            this.status({});
            this.host.connect((err, odoo_inst) => {
                if (err) {
                    return handle_error(err);
                }

                //node.log('Deleting ' + ids.length + ' records for model "' + config.model + '"...');
                odoo_inst.execute_kw(config.model, 'unlink', msg.payload, (err, value) => {
                    if (err) {
                        return handle_error(err);
                    }
                    msg.payload = value;
                    this.send(msg);
                });
            });
        });
    }

    RED.nodes.registerType("odoo-xmlrpc-unlink", OdooXMLRPCUnlinkNode);
};
