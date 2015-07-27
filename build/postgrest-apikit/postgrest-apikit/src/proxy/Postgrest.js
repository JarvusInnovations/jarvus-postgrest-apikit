Ext.define('Jarvus.proxy.Postgrest', {
    extend: 'Ext.data.proxy.Rest',
    alternateClassName: 'Jarvus.proxy.PostgrestProxy',
    alias : 'proxy.postgrest',

    /**
     * @property {Object} actionMethods
     * Mapping of action name to HTTP request method. These default to RESTful conventions for the 'create', 'read',
     * 'update' and 'destroy' actions (which map to 'POST', 'GET', 'PUT' and 'DELETE' respectively). This object
     * should not be changed except globally via {@link Ext#override Ext.override} - the {@link #getMethod} function
     * can be overridden instead.
     */

    defaultActionMethods: {
        create : 'POST',
        read   : 'GET',
        update : 'PUT',
        destroy: 'DELETE'
    },

    slashRe: /\/$/,
    periodRe: /\.$/,

    config: {
        /**
         * @cfg {Boolean} appendId
         * True to automatically append the ID of a Model instance when performing a request based on that single instance.
         * See Rest proxy intro docs for more details. Defaults to true.
         */
        appendId: true,

        /**
         * @cfg {String} format
         * Optional data format to send to the server when making any request (e.g. 'json'). See the Rest proxy intro docs
         * for full details. Defaults to undefined.
         */
        format: null,

        /**
         * @cfg {Boolean} batchActions
         * True to batch actions of a particular type when synchronizing the store. Defaults to false.
         */
        batchActions: false,

        /**
         * @cfg {Object} actionMethods
         * @inheritdoc
         */
        actionMethods: {
            create : 'POST',
            read   : 'GET',
            update : 'PUT',
            destroy: 'DELETE'
        }
    },

    /**
     * Specialized version of buildUrl that incorporates the {@link #appendId} and {@link #format} options into the
     * generated url. Override this to provide further customizations, but remember to call the superclass buildUrl so
     * that additional parameters like the cache buster string are appended.
     * @param {Object} request
     */
    buildUrl: function(request) {
        var me        = this,
            operation = request.getOperation(),
            records   = operation.getRecords(),
            record    = records ? records[0] : null,
            format    = me.getFormat(),
            url       = me.getUrl(request),
            id, params;

        if (record && !record.phantom) {
            id = record.getId();
        } else {
            id = operation.getId();
        }

        if (me.getAppendId() && me.isValidId(id)) {
            if (!url.match(me.slashRe)) {
                url += '/';
            }

            url += encodeURIComponent(id);
            params = request.getParams();
            if (params) {
                delete params[me.getIdParam()];
            }
        }

        if (format) {
            if (!url.match(me.periodRe)) {
                url += '.';
            }

            url += format;
        }

        request.setUrl(url);

        return me.callParent([request]);
    },

    isValidId: function(id) {
        return id || id === 0;
    }
});