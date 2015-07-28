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
        'Jurisdictions'
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

        // export fun stuff to global for console
        window.jurisdictionsStore = this.getJurisdictionsStore();
        window.jurisdictionsGrid = this.getMainView();
    },

    /**
     * Run from console via `PostgrestTest.app.runDemoCalls()`
     */
    runDemoCalls: function() {

        // See Ext.data.Connection docs for all request options: http://docs.sencha.com/extjs/5.1/5.1.1-apidocs/#!/api/Ext.data.Connection-method-request

        // get a list of all tables
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

        // custom headers
        Jarvus.connection.Postgrest.request({
            url: '/custom-headers',
            headers: {
                'X-Foo': 'bar'
            }
        });

        // raw method and body
        Jarvus.connection.Postgrest.request({
            method: 'PATCH',
            url: '/raw-data',
            headers: {
                'Content-Type': 'application/foobar'
            },
            rawData: 'FOO____BAR'
        });

        // post multipart form data
        var formData = new FormData();
        formData.append('foo', new File(['line1','line2','line3'], 'foobar.txt', {'type': 'text/plain'})); // could get file from a drop or <input type="file">

        Jarvus.connection.Postgrest.request({
            method: 'POST',
            url: '/multipart-form-data',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            rawData: formData
        });

        // post a javascript object
        Jarvus.connection.Postgrest.request({
            method: 'POST',
            url: '/json-data',
            jsonData: {
                foo: 'bar'
            }
        });

        // post form data
        Jarvus.connection.Postgrest.request({
            method: 'POST',
            url: '/form-data',
            params: {
                foo: 'bar'
            }
        });
    }
});
