

module.exports = function (RED) {
    function OdooXMLRPCUpdateNode(config) {
        RED.nodes.createNode(this, config);
        this.host = RED.nodes.getNode(config.host);

        const handle_error = function(err) {
            console.log(err.body);
            this.status({fill: "red", shape: "dot", text: err.message});
            this.error(err.message);
        };

        this.on('input', (msg) => {
            this.status({});
            this.host.connect((err, odoo_inst) => {
                if (err) {
                    return handle_error(err);
                }

                //node.log('Creating object for model "' + config.model + '"...');
                odoo_inst.execute_kw(config.model, 'write', msg.payload, (err, value) => {
                    if (err) {
                        return handle_error(err);
                    }
                    msg.payload = value;
                    this.send(msg);
                });
            });
        });
    }

    RED.nodes.registerType("odoo-xmlrpc-update", OdooXMLRPCUpdateNode);
};
