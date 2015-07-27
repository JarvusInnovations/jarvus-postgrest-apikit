Ext.define('Jarvus.reader.Postgrest', {
    extend: 'Ext.data.reader.Json',
    alternateClassName: 'Jarvus.reader.PostgrestReader',
    alias : 'reader.postgrest',

    getTotal: function() {
        debugger;
        console.log(this);
    }
});