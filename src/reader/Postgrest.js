Ext.define('Jarvus.reader.Postgrest', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.postgrest',

    config: {
        totalProperty: null,
        successProperty: null,
        rootProperty: null,
        messageProperty: null
    },

    buildExtractors: Ext.emptyFn,

    read: function(response) {
        var data = this.callParent(arguments),
            contentRange = response.getResponseHeader('Content-Range');

        if (contentRange && (contentRange = contentRange.split('/')).length === 2) {
            data.total = parseInt(contentRange[1], 10);
        }

        return data;
    }
});