/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('PostgrestTest.Application', {
    extend: 'Ext.app.Application',

    requires: [
        'PostgrestTest.model.Jurisdiction',
        'PostgrestTest.store.Jurisdictions',
        'Jarvus.connection.Postgrest',
        'Jarvus.proxy.Postgrest',
        'Jarvus.reader.Postgrest'
    ],
    
    name: 'PostgrestTest',

    stores: [
        'PostgrestTest.store.Jurisdictions'
    ],
    
    launch: function () {
        // Ext.getStore('PostgrestTest.store.Jurisdictions').load({callback: function loaded() {
        //     debugger;

        //     var store = Ext.getStore('PostgrestTest.store.Jurisdictions');

        //     store.filter([{
        //         property: 'title',
        //         operator: 'in',
        //         value:    ['Pennsylvania', 'New Jersey', 'Delaware']
        //     }]);
        // }});


        // demo call: get a list of tables
        Jarvus.connection.Postgrest.request({
            url: '/',
            success: function(response) {
                var r = Ext.decode(response.responseText);

                console.log('Loaded list of schemas');
                console.table(r);
            }
        });

        // load all jurisdictions
        Jarvus.connection.Postgrest.request({
            url: '/jurisdictions',
            success: function(response) {
                var r = Ext.decode(response.responseText);

                console.log('Loaded list of jurisdictions');
                console.table(r);
            }
        });
        
        // load one jurisdiction
        Jarvus.connection.Postgrest.request({
            url: '/jurisdictions',
            urlParams: {
                id: 'eq.3'
            },
            success: function(response) {
                var r = Ext.decode(response.responseText);

                console.log('Loaded one jurisdiction:', r[0]);
            }
        });
    }
});
