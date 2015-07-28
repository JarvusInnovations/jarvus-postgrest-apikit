Ext.define('PostgrestTest.store.Jurisdictions', {
    extend: 'Ext.data.Store',
    requires: [
        'Jarvus.proxy.Postgrest',
        'Jarvus.reader.Postgrest'
    ],

    model: 'PostgrestTest.model.Jurisdiction',

    pageSize: 5,

    proxy: {
        type: 'postgrest',
        url:  '/jurisdictions',
    reader: {
        type: 'postgrest'
    },
    writer: {
        type: 'json'
    },
    },

    remoteSort:   true,
    remoteFilter: true,

    sorters: [{
        property:  'id',
        direction: 'asc'
    }],

    filters: [{
        property: 'title',
        operator: 'in',
        value:    ['Pennsylvania', 'New Jersey']
    }],

    autoSync: true
});