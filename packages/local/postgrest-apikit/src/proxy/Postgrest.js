Ext.define('Jarvus.proxy.Postgrest', {
    extend: 'Jarvus.proxy.API',
    alias : 'proxy.postgrest',
    requires: [
        'Jarvus.connection.Postgrest',
        'Jarvus.reader.Postgrest',
        'Jarvus.writer.Postgrest'
    ],


    config: {
        connection: 'Jarvus.connection.Postgrest',

        headers: {
            Prefer: 'return=representation'
        },

        reader: 'postgrest',
        writer: 'postgrest'
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
    filterOperators: ['eq', 'gt', 'lt', 'gte', 'lte', 'neq', 'like', 'ilike', 'is', 'isnot', 'in'],

    getHeaders: function(request) {
        var headers = this.callParent(),
            action = request.getAction(),
            operation = request.getOperation(),
            page, start, limit;

        if (action == 'read') {
            page = operation.getPage(),
            start = operation.getStart(),
            limit = operation.getLimit();

            if (limit && page) {
                headers['Range-Unit'] = 'items';
                headers['Range'] = ((page - 1) * limit) + '-' + (start + limit - 1);
            } else if(start || start === 0 || limit) {
                headers['Range-Unit'] = 'items';
                headers['Range'] = (start || 0) + '-' + (limit - 1 || '');
            }
        }

        return headers;
    },

    getParams: function(operation) {
        var me = this,
            filterOperators = me.filterOperators,

            action = operation.getAction(),
            isRead = action == 'read',
            records = operation.getRecords(),
            record = records ? records[0] : null,

            sorters = isRead && operation.getSorters(),

            filters = isRead && operation.getFilters(),
            filtersLength = filters && filters.length, filterIndex = 0,
            filter, filterOperator, filterValue,

            params = {};

        // do not call parent, we don't want any metadata added to the parameters

        // handle remote sorting
        if (sorters && sorters.length > 0) {
            params.order = me.encodeSorters(sorters);
        }

        // write filters
        if (filtersLength) {
            for (; filterIndex < filtersLength; filterIndex++) {
                filter = filters[filterIndex];
                filterOperator = filter.getOperator() || 'eq';
                filterValue = filter.getValue();

                if (filterOperators.indexOf(filterOperator) === -1) {
                    Ext.Error.raise(filterOperators + ' is not in the list of supported filter operators: ' +  me.filterOperators.join(','));
                }

                if (filterOperator === 'in') {
                    if (!Ext.isArray(filterValue)) {
                        Ext.Error.raise('the in filter operator requires values to be an array, not: ' + filterValue);
                    }

                    filterValue = filterValue.join(',');
                }

                params[filter.getProperty()] = filterOperator + '.' + filterValue;
            }
        }

        // target ID for update and destroy ops must be specified as a filter
        if (action == 'update' || action == 'destroy') {
            params[record.getIdProperty()] = 'eq.' + record.getId();
        }

        return params;
    },

    encodeSorters: function(sorters) {
        return sorters.map(function(sorter) {
            var direction = sorter.getDirection(),
                sortStr = sorter.getProperty();

            if (direction) {
                sortStr += '.' + direction.toLowerCase();
            }

            if (sorter.nullsFirst) {
                sortStr += '.nullsfirst';
            }

            if (sorter.nullsLast) {
                sortStr += '.nullslast';
            }

            return sortStr;
        }).join(',');
    }
});