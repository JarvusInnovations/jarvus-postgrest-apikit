Ext.define('PostgrestTest.model.Jurisdiction', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Negative'
    ],


    identifier: 'negative',

    fields: [
        { name: 'id', type: 'int', persist: false },
        { name: 'title', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'document', type: 'string' }
    ]
});