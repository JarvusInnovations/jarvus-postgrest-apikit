Ext.define('PostgrestTest.model.Jurisdiction', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'int', persist: false },
        { name: 'title', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'document', type: 'string' }
    ]
});