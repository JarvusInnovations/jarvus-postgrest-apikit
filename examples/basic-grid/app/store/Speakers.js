Ext.define('PostgrestTest.store.Speakers', {
    extend: 'Ext.data.Store',


    model: 'PostgrestTest.model.Speaker',

    autoSync: true,

    pageSize: false,
    // pageSize: 100,

    remoteSort: true,

    sorters: [{
        property: 'name',
        direction: 'desc'
    }],

    remoteFilter: true,

    // filters: [{
    //     property: 'country_id',
    //     operator: 'lt',
    //     value: 50
    // }],

});