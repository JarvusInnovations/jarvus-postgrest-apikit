Ext.define('PostgrestTest.store.Jurisdictions', {
    extend: 'Ext.data.Store',
    requires: [
        'Jarvus.proxy.Postgrest'
    ],

    model: 'PostgrestTest.model.Jurisdiction',

    pageSize: 100,

    proxy: {
        type: 'postgrest',
        url:  '/jurisdictions'
    },

    // remoteSort:   true,
    // remoteFilter: true,

    // sorters: [{
    //     property:  'id',
    //     direction: 'asc'
    // }],

    // filters: [{
    //     property: 'title',
    //     operator: 'in',
    //     value: ['Pennsylvania', 'New Jersey']
    // }],

    autoSync: true
});