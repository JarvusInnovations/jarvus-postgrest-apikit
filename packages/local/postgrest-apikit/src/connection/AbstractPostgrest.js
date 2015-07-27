/*jslint browser: true, undef: true*//*global Ext*/

/**
 * Abstract connection for a Postgrest server
 */
Ext.define('Jarvus.connection.AbstractPostgrest', {
    extend: 'Jarvus.util.AbstractAPI',

	config: {
        host: 'localhost:3000'
    }
});