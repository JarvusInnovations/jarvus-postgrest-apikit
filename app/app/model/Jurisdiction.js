Ext.define('PostgrestTest.model.Jurisdiction', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Negative'
    ],


    identifier: 'negative',

    fields: [
        {
            name: 'id',
            type: 'int',
            validators: {
                type: 'range',
                min: 1
            }
        },
        {
            name: 'title',
            type: 'string',
            validators: 'presence'
        },
        { name: 'type', type: 'string' },
        { name: 'document', type: 'string' }
    ]
});