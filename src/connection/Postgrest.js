/*jslint browser: true, undef: true*//*global Ext*/

/**
 * Default connection to Postgrest server
 */
Ext.define('Jarvus.connection.Postgrest', {
    extend: 'Jarvus.connection.AbstractPostgrest',
    singleton: true
});