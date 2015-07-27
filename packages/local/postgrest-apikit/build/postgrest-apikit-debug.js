Ext.define('Jarvus.proxy.Postgrest', {
    extend: 'Ext.data.proxy.Rest',
    alternateClassName: 'Jarvus.proxy.PostgrestProxy',
    alias: 'proxy.postgrest',
    /**
     * @property {Object} actionMethods
     * Mapping of action name to HTTP request method. These default to RESTful conventions for the 'create', 'read',
     * 'update' and 'destroy' actions (which map to 'POST', 'GET', 'PUT' and 'DELETE' respectively). This object
     * should not be changed except globally via {@link Ext#override Ext.override} - the {@link #getMethod} function
     * can be overridden instead.
     */
    config: {
        /**
         * @cfg {Boolean} appendId
         * True to automatically append the ID of a Model instance when performing a request based on that single instance.
         * See Rest proxy intro docs for more details. Defaults to true.
         */
        appendId: true,
        /**
         * @cfg {Boolean} batchActions
         * True to batch actions of a particular type when synchronizing the store. Defaults to false.
         */
        batchActions: true,
        /**
         * @cfg {Object} actionMethods
         * @inheritdoc
         */
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'PATCH',
            destroy: 'DELETE'
        },
        /**
         * @cfg {Boolean} nullsFirst
         * True to return nulls first when sorting
         */
        nullsFirst: false,
        /**
         * @cfg {Boolean} nullsLast
         * True to return nulls last when sorting
         */
        nullsLast: false,
        remoteSort: true,
        remoteFilter: true
    },
    /**
     * These parameters are what postgrest requires, they should not be changed:
     */
    sortParam: 'order',
    /**
     * Specialized version of buildUrl that incorporates the {@link #appendId} and {@link #format} options into the
     * generated url. Override this to provide further customizations, but remember to call the superclass buildUrl so
     * that additional parameters like the cache buster string are appended.
     * @param {Object} request
     */
    buildUrl: function(request) {
        var me = this,
            operation = request.getOperation(),
            records = operation.getRecords(),
            record = records ? records[0] : null,
            format = me.getFormat(),
            url = me.getUrl(request),
            id, params;
        if (record && !record.phantom) {
            id = record.getId();
        } else {
            id = operation.getId();
        }
        if (me.getAppendId() && me.isValidId(id) && !operation.node.isRoot()) {
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
        return me.callParent([
            request
        ]);
    },
    doRequest: function(operation) {
        var me = this,
            request;
        request = me.callParent([
            operation
        ]);
        request.setConfig({
            headers: me.getHeaders(operation)
        });
        return me.sendRequest(request);
    },
    /**
     * Encodes the array of {@link Ext.util.Sorter} objects into a string to be sent in the request url. By default,
     * this simply JSON-encodes the sorter data
     * @param {Ext.util.Sorter[]} sorters The array of {@link Ext.util.Sorter Sorter} objects
     * @return {String} The encoded sorters
     */
    encodeSorters: function(sorters) {
        return sorters.map(function(sorter) {
            var sortStr = sorter.property;
            if (sorter.direction) {
                sortStr += '.' + sorter.direction.toLowerCase();
            }
            if (sorter.nullsFirst) {
                sortStr += '.nullsfirst';
            }
            if (sorter.nullsLast) {
                sortStr += '.nullslast';
            }
            return sortStr;
        }).join(',');
    },
    /**
     * postgrest supports the following operators:
     * ===========================================
     * eq    | equals
     * gt    | greater than
     * lt    | less than
     * gte   | greater than or equal
     * lte   | less than or equal
     * neq   | not equal
     * like  | LIKE operator (use * in place of %)
     * ilike | ILIKE operator (use * in place of %)
     * is	 | checking for exact equality (null,true,false)
     * isnot |checking for exact inequality
     * in	 | one of a list of values e.g. `?a=in.1,2,3`
     */
    filterOperators: [
        'eq',
        'gt',
        'lt',
        'gte',
        'lte',
        'neq',
        'like',
        'ilike',
        'is',
        'isnot',
        'in'
    ],
    /**
     * @param {Ext.util.Filter[]} filters The array of {@link Ext.util.Filter Filter} objects
     * @return {String} The encoded filters
     */
    encodeFilters: function(params, filters) {
        var me = this;
        return filters.reduce(function(params, filter) {
            var operator = filter.operator || 'eq',
                property = filter.property,
                value = filter.value;
            if (operator && me.filterOperators.indexOf(operator) === -1) {
                // TODO: see if we can raise a warning here in ExtJS land and set it to eq
                Ext.Error.raise(filter + 'is not in the list of supported filter operators: ' + me.filterOperators.join(','));
            }
            if (operator === 'in' && Ext.isArray(value)) {
                value = value.join(',');
            }
            filters[property] = operator + '.' + value;
            return params;
        }, params);
    },
    /**
     * @private
     * Copy any sorters, filters etc into the params so they can be sent over the wire
     */
    getParams: function(operation) {
        if (!operation.isReadOperation) {
            return {};
        }
        var me = this,
            params = {},
            grouper = operation.getGrouper(),
            sorters = operation.getSorters(),
            simpleSortMode = me.getSimpleSortMode(),
            simpleGroupMode = me.getSimpleGroupMode(),
            groupParam = me.getGroupParam(),
            groupDirectionParam = me.getGroupDirectionParam(),
            sortParam = me.getSortParam(),
            directionParam = me.getDirectionParam(),
            hasGroups, index;
        hasGroups = groupParam && grouper;
        if (hasGroups) {
            // Grouper is a subclass of sorter, so we can just use the sorter method
            if (simpleGroupMode) {
                params[groupParam] = grouper.getProperty();
                params[groupDirectionParam] = grouper.getDirection();
            } else {
                params[groupParam] = me.encodeSorters([
                    grouper
                ], true);
            }
        }
        // TODO: Check if grouping and simple sorting generates a valid request
        if (sortParam && sorters && sorters.length > 0) {
            if (simpleSortMode) {
                index = 0;
                // Group will be included in sorters, so grab the next one
                if (sorters.length > 1 && hasGroups) {
                    index = 1;
                }
                params[sortParam] = sorters[index].getProperty();
                params[directionParam] = sorters[index].getDirection();
            } else {
                params[sortParam] = me.encodeSorters(sorters);
            }
        }
        filters.encodeFilters(operation.getFilters(), params);
        return params;
    },
    getHeaders: function(operation) {
        var me = this,
            headers = me.headers,
            page = operation.getPage(),
            start = operation.getStart(),
            limit = operation.getLimit();
        // Build pagination
        if (limit && page) {
            headers['Range-Unit'] = 'items';
            headers['Range'] = ((page - 1) * limit) + '-' + (start + limit);
        } else if (start || start === 0 || limit) {
            headers['Range-Unit'] = 'items';
            headers['Range'] = (start || 0) + '-' + (limit || '');
        }
        return me.headers;
    }
});

