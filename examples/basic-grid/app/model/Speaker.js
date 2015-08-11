Ext.define('PostgrestTest.model.Speaker', {
    extend: 'Jarvus.model.Postgrest',

    // the path will be used to load fields from the Postgrest server
    tableUrl: '/speakers',
    fetchRemoteFields: true,

    idProperty: 'id',

    validators: {
        name: {
            type: 'length',
            min: 3
        },
        avatar_url: {
            type: 'format',
            matcher: /^http/
        }
    }
    /**
     * You may define additional fields. Server-side fields will overwrite localy defined fields with the same name
     */
    // fields: [
    //     {
    //         name: 'documentTitle',

    //         // elevate attributes from json fields to first-class fields
    //         mapping: 'document.title'
    //     },
    //     {
    //         name: 'documentKeys',

    //         // create a virtual field that can be initialized to anything based on other fields, see also {@link Ext.data.field.Field#cfg-depends}
    //         convert: function(v, r) {
    //             var document = r.get('document');
 
    //             if (document && r.get('id') % 2) {
    //                 delete document.type;
    //             }

    //             return Ext.Object.getKeys(document);
    //         },

    //         // customize what value the field is locally sorted as
    //         sortType: function(v) {
    //             return v.length;
    //         }
    //     }
    // ]
});