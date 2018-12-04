rs.initiate();
cfg = {
    _id: 'rs',
    members: [
        { _id: 0, host: 'mongo-db:27017' }
    ]
};
cfg.protocolVersion = 1;
rs.reconfig(cfg, { force: true });
