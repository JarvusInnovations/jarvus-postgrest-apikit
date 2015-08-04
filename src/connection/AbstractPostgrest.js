/*jslint browser: true, undef: true*//*global Ext*/

/**
 * Abstract connection for a Postgrest server
 */
Ext.define('Jarvus.connection.AbstractPostgrest', {
    extend: 'Jarvus.util.AbstractAPI',

	config: {
		withCredentials: false
    },

	getTables: function(callback, scope) {
        this.request({
            url: '/',
            success: function(response) {
                Ext.callback(callback, scope, [response.data, true, response]);
            },
            exception: function(response) {
                Ext.callback(callback, scope, [null, false, response]);
            }
        });
    }
});