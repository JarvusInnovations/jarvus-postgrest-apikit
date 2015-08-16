Ext.define('Jarvus.model.Postgrest', {
    extend: 'Ext.data.Model',
    requires: [
        'Jarvus.connection.Postgrest',
        'Jarvus.proxy.Postgrest',
        'Ext.data.identifier.Negative'
    ],


    identifier: 'negative',
    fetchRemoteFields: false,

    onClassExtended: function(modelCls, data, hooks) {
        var onBeforeClassCreated = hooks.onBeforeCreated,
            tableUrl = data.tableUrl,
            modelProxy;

        if (!tableUrl) {
            throw modelCls.$className + ' attempting to extend ' + this.$className + ' without defining path';
        }

        if (!modelCls.proxyConfig) {
            modelCls.proxyConfig = 'postgrest';
        }

        modelProxy = modelCls.getProxy();

        if (modelProxy instanceof Jarvus.proxy.Postgrest) {
            modelProxy.setUrl(tableUrl);
        }

        // automatically fetch fields from server
        if (!data.fetchRemoteFields) {
            return;
        }
        hooks.onBeforeCreated = function() {
            var me = this,
                args = arguments,
                idFieldFound = 'id' in modelCls.fieldsMap,
                idProperty = modelCls.idProperty;

            // TODO: cache in localStorage?
            Jarvus.connection.Postgrest.request({
                method: 'OPTIONS',
                url: tableUrl,
                success: function(response) {
                    var columns = response.data.columns,
                        columnsLength = columns.length, columnIndex = 0, column, columnName, field, fieldConfig,
                        fields = [];

                    for (; columnIndex < columnsLength; columnIndex++) {
                        column = columns[columnIndex];
                        columnName = column.name;

                        fieldConfig = {
                            postgrestColumn: column,

                            name: columnName,
                            allowNull: column.nullable,
                            persist: column.updatable
                        };

                        switch (column.type) {
                            case 'character varying':
                            case 'string':
                                fieldConfig.type = 'string';
                                break;
                            case 'integer':
                                fieldConfig.type = 'integer';
                                break;
                        }

                        field = new Ext.data.field.Field(fieldConfig);

                        // If not nullable & no default value, set 'presence' validation on model
                        if( ! column.nullable && ! column.default) {
                            field.setModelValidators('presence');
                        }

                        fields.push(field);

                        if (columnName == 'id') {
                            idFieldFound = true;
                        }
                    }

                    // ensure an 'id' field exists or addFields/replaceFields will shit the bed: https://www.sencha.com/forum/showthread.php?303756
                    if (!idFieldFound) {
                        fields.push({
                            name: 'id',
                            persist: false,
                            depends: [idProperty],
                            convert: function(v, r) {
                                return r.get(idProperty);
                            }
                        });
                    }

                    modelCls.addFields(fields);

                    onBeforeClassCreated.apply(me, args);
                }
            });
        };
    }
});
