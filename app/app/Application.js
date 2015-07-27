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
        'Jarvus.proxy.Postgrest',
        'Jarvus.reader.Postgrest'
    ],
    
    name: 'PostgrestTest',

    stores: [
        'PostgrestTest.store.Jurisdictions'
    ],
    
    launch: function () {
        Ext.getStore('PostgrestTest.store.Jurisdictions').load({callback: function loaded() {
            debugger;

            var store = Ext.getStore('PostgrestTest.store.Jurisdictions');

            store.filter([{
                property: 'title',
                operator: 'in',
                value:    ['Pennsylvania', 'New Jersey', 'Delaware']
            }]);
        }});
    }
});
