Ext.define('Jarvus.writer.Postgrest', {
    extend: 'Ext.data.writer.Writer',
    alias: 'writer.postgrest',


    getRecordData: function (record) {
        return record.getData({ changes: true });
    },

    writeRecords: function(request, data) {
        if (data.length === 1) {
            data = data[0];
        }

        request.setJsonData(data);

        return request;
    }
});