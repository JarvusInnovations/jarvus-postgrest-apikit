Ext.define('Jarvus.proxy.Postgrest', {
    extend: 'Jarvus.proxy.API',
    alias : 'proxy.postgrest',
    requires: [
        'Jarvus.connection.Postgrest',
        'Jarvus.writer.Postgrest'
    ],


    config: {
        connection: 'Jarvus.connection.Postgrest',

        noCache: false,

        actionMethods: {
            update: 'PATCH',
            destroy: 'DELETE'
        },

        headers: {
            Prefer: 'return=representation'
        },

        writer: {
            type: 'postgrest'
        }
        // /**
        //  * @cfg {Boolean} appendId
        //  * True to automatically append the ID of a Model instance when performing a request based on that single instance.
        //  * See Rest proxy intro docs for more details. Defaults to true.
        //  */
        // appendId: true,


        // /**
        //  * @cfg {Boolean} batchActions
        //  * True to batch actions of a particular type when synchronizing the store. Defaults to false.
        //  */
        // batchActions: true,

        // /**
        //  * @cfg {Object} actionMethods
        //  * @inheritdoc
        //  */
        // actionMethods: {
        //     create : 'POST',
        //     read   : 'GET',
        //     update : 'PATCH',
        //     destroy: 'DELETE'
        // },

        // /**
        //  * @cfg {Boolean} nullsFirst
        //  * True to return nulls first when sorting
        //  */
        // nullsFirst: false,

        // /**
        //  * @cfg {Boolean} nullsLast
        //  * True to return nulls last when sorting
        //  */
        // nullsLast: false,

        // remoteSort: true,

        // remoteFilter: true,

        // noCache: false
    },

    getUrl: function(request) {
        var me = this,
            url = me.callParent(arguments),
            action = request.getAction(),
            operation = request.getOperation(),
            records = operation.getRecords(),
            record = records ? records[0] : null;

        // debugger;
        // if (action == 'update') {
        //     url += '/' + record.getId();
        // }

        return url;
    },

    getParams: function(operation) {
        var action = operation.getAction(),
            records = operation.getRecords(),
            record = records ? records[0] : null,
            params = {};

        // do not call parent, we don't want any metadata added to the parameters
        if (action == 'update' || action == 'destroy') {
            params[record.getIdProperty()] = 'eq.' + record.getId();
        }

        return params;
    }

    // /**
    //  * These parameters are what postgrest requires, they should not be changed:
    //  */
    // sortParam: 'order',

    // buildUrl: function(request) {
    //     var me        = this,
    //         operation = request.getOperation(),
    //         records   = operation.getRecords()|| [],
    //         record    = records[0],
    //         format    = me.format,
    //         url       = me.getUrl(request),
    //         urlParams = {},
    //         id        = record ? record.getId() : '',
    //         idProp;

    //     if (me.appendId && me.isValidId(id) && !operation.isUpdateOperation) {
    //         if (!url.match(/\/$/)) {
    //             url += '/';
    //         }

    //         url += id;
    //     }

    //     if (format) {
    //         if (!url.match(/\.$/)) {
    //             url += '.';
    //         }

    //         url += format;
    //     }

    //     if (operation.isUpdateOperation) {
    //         idProp = record.getIdProperty();
    //         urlParams[idProp] = 'eq.' + id;
    //     }
 
    //     request.setUrl(url);
    //     request.setUrlParams(urlParams);

    //     return me.callParent(arguments);
    // },

    // buildRequest: function(operation) {
    //     var me = this,
    //         initialParams = Ext.apply({}, operation.getParams()),

    //         params = Ext.applyIf(initialParams, me.getExtraParams() || {}),
    //         headers = {},

    //         request, operationId, idParam, page, start, limit;

    //     Ext.applyIf(params, me.getParams(operation));

    //     operationId = operation.getId();
    //     idParam = me.getIdParam();

    //     if (operationId !== undefined && params[idParam] === undefined) {
    //         params[idParam] = operationId;
    //     }

    //     if (operation.isReadOperation) {
    //         // operation.getPage() does not exist unless it is a read operation
    //         page = operation.getPage(),
    //         start = operation.getStart(),
    //         limit = operation.getLimit();

    //         // HACK: getHeaders() doesn't have access to operation, so we're doing this here...
    //         if (limit && page) {
    //             headers['Range-Unit'] = 'items';
    //             headers['Range'] = ((page -1) * limit) + '-' + (start + limit - 1);
    //         } else if(start || start === 0 || limit) {
    //             headers['Range-Unit'] = 'items';
    //             headers['Range'] = (start || 0) + '-' + (limit - 1 || '');
    //         }
    //     }

    //     if (operation.isUpdateOperation) {
    //         debugger;
    //     }

    //     request = new Ext.data.Request({
    //         params: params,
    //         action: operation.getAction(),
    //         records: operation.getRecords(),
    //         url: operation.getUrl(),
    //         operation: operation,
    //         proxy: me,
    //         headers: headers
    //     });

    //     request.setUrl(me.buildUrl(request));
    //     operation.setRequest(request);

    //     return request;
    // },

    // // Should this be documented as protected method?
    // processResponse: function(success, operation, request, response) {
    //     var me = this,
    //         serverId = null,
    //         locationHeader, records, record;

    //     if (success && operation.isCreateOperation) {
    //         records = operation.getRecords();
    //         locationHeader = response.getResponseHeader('location');

    //         if (records.length > 1) {
    //             Ext.Error.raise('postgrest supports bulk inserts/updates; but we do not... yet');
    //         }

    //         // TODO: support bulk inserts
    //         record = records[0];

    //         if (locationHeader) {
    //             // Expected format, where the newly inserted ID is 1: /tableName?id=eq.1
    //             // TODO: support different ID fields
    //             serverId = parseInt(Ext.urlDecode(locationHeader.slice(locationHeader.indexOf('?')))[record.getIdProperty()].split('.')[1], 10);
    //         } else {
    //            Ext.Error.raise('postgrest can return the entire document instead of a location; but we don\'t support it... yet');
    //         }

    //         if (serverId != null) {
    //             record.set(record.getIdProperty(), serverId);
    //         } else {
    //             Ext.Error.raise('unable to determine the id of a newly created record');
    //         }
    //     }

    //     me.callParent([success, operation, request, response]);
    // },

    // /**
    //  * Encodes the array of {@link Ext.util.Sorter} objects into a string to be sent in the request url. By default,
    //  * this simply JSON-encodes the sorter data
    //  * @param {Ext.util.Sorter[]} sorters The array of {@link Ext.util.Sorter Sorter} objects
    //  * @return {String} The encoded sorters
    //  */
    // encodeSorters: function(sorters) {
    //     return sorters.map(function(sorter) {
    //         var direction = sorter.getDirection(),
    //             sortStr = sorter.getProperty();

    //         if (direction) {
    //             sortStr += '.' + direction.toLowerCase();
    //         }

    //         if (sorter.nullsFirst) {
    //             sortStr += '.nullsfirst';
    //         }

    //         if (sorter.nullsLast) {
    //             sortStr += '.nullslast';
    //         }

    //         return sortStr;
    //     }).join(',');
    // },

    // /**
    //  * postgrest supports the following operators:
    //  * ===========================================
    //  * eq    | equals
    //  * gt    | greater than
    //  * lt    | less than
    //  * gte   | greater than or equal
    //  * lte   | less than or equal
    //  * neq   | not equal
    //  * like  | LIKE operator (use * in place of %)
    //  * ilike | ILIKE operator (use * in place of %)
    //  * is	 | checking for exact equality (null,true,false)
    //  * isnot |checking for exact inequality
    //  * in	 | one of a list of values e.g. `?a=in.1,2,3`
    //  */
    // filterOperators: ['eq', 'gt', 'lt', 'gte', 'lte', 'neq', 'like', 'ilike', 'is', 'isnot', 'in'],

    // /**
    //  * @private
    //  * Copy any sorters, filters etc into the params so they can be sent over the wire
    //  */
    // getParams: function(operation) {
    //     if (!operation.isReadOperation) {
    //         return {};
    //     }

    //     var me = this,
    //         params = {},
    //         grouper = operation.getGrouper(),
    //         sorters = operation.getSorters(),
    //         simpleSortMode = me.getSimpleSortMode(),
    //         simpleGroupMode = me.getSimpleGroupMode(),
    //         groupParam = me.getGroupParam(),
    //         groupDirectionParam = me.getGroupDirectionParam(),
    //         sortParam = me.getSortParam(),
    //         directionParam = me.getDirectionParam(),
    //         hasGroups, index;

    //     hasGroups = groupParam && grouper;
    //     if (hasGroups) {
    //         // Grouper is a subclass of sorter, so we can just use the sorter method
    //         if (simpleGroupMode) {
    //             params[groupParam] = grouper.getProperty();
    //             params[groupDirectionParam] = grouper.getDirection();
    //         } else {
    //             params[groupParam] = me.encodeSorters([grouper], true);
    //         }
    //     }

    //     // TODO: Check if grouping and simple sorting generates a valid request
    //     if (sortParam && sorters && sorters.length > 0) {
    //         if (simpleSortMode) {
    //             index = 0;
    //             // Group will be included in sorters, so grab the next one
    //             if (sorters.length > 1 && hasGroups) {
    //                 index = 1;
    //             }
    //             params[sortParam] = sorters[index].getProperty();
    //             params[directionParam] = sorters[index].getDirection();
    //         } else {
    //             params[sortParam] = me.encodeSorters(sorters);
    //         }
    //     }

    //     // This directly modifies parameters, so it is not compatible with the encodeFilters signature
    //     (operation.getFilters() || []).forEach(function(filter) {
    //         var operator = filter.getOperator() || 'eq',
    //             property = filter.getProperty(),
    //             value = filter.getValue();

    //         if (operator && me.filterOperators.indexOf(operator) === -1) {
    //             Ext.Error.raise(operator + ' is not in the list of supported filter operators: ' +  me.filterOperators.join(','));
    //             Ext.Error.raise
    //         }

    //         if (operator === 'in') {
    //             if (!Ext.isArray(value)) {
    //                 Ext.Error.raise('the in filter operator requires values to be an array, not: ' + value);
    //             }

    //             value = value.join(',');
    //         }

    //         params[property] = operator + '.' + value;
    //     });
        
    //     return params;
    // },

    // isValidId: function(id) {
    //     return id || id === 0;
    // }
});