/* global Jarvus */
/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('PostgrestTest.Application', {
    extend: 'Ext.app.Application',

    requires: [
        'Jarvus.connection.Postgrest'
    ],
    
    name: 'PostgrestTest',

    stores: [
        'Speakers'
    ],

    launch: function () {
        // export fun stuff to global for console
        console.group('Exporting to window for console use')
        console.info('speakersStore:', window.speakersStore = this.getSpeakersStore());
        console.info('speakersGrid:', window.speakersGrid = this.getMainView());
        console.groupEnd();

        Jarvus.connection.Postgrest.getTables(function(tables, success, response) {
            console.groupCollapsed('All available tables on', Jarvus.connection.Postgrest.getHost());
            console.table(tables);
            console.groupEnd();
        });

        Jarvus.connection.Postgrest.request({
            method: 'OPTIONS',
            url: '/speakers',
            success: function(response) {
                console.groupCollapsed('Columns for /speakers');
                console.table(response.data.columns);
                console.groupEnd();
            }
        });
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

        // load all speakers
        Jarvus.connection.Postgrest.request({
            url: '/speakers',
            success: function(response) {
                var r = Ext.decode(response.responseText);

                console.log('Loaded list of speakers');
                console.table(r);
            }
        });
        
        // load one speakers
        Jarvus.connection.Postgrest.request({
            url: '/speakers',
            urlParams: {
                id: 'eq.3'
            },
            success: function(response) {
                var r = Ext.decode(response.responseText);

                console.log('Loaded one speakers:', r[0]);
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
