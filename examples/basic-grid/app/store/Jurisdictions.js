Ext.define('PostgrestTest.store.Jurisdictions', {
    extend: 'Ext.data.Store',

    model: 'PostgrestTest.model.Jurisdiction',

    pageSize: 100,

    remoteSort: true,

    sorters: [{
        property: 'id',
        direction: 'desc'
    }],

    remoteFilter: true,

    filters: [{
        property: 'id',
        operator: 'lt',
        value: 50
    }],

    autoSync: true
});