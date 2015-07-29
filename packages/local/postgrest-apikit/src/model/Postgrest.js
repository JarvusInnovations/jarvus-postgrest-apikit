Ext.define('Jarvus.model.Postgrest', {
    extend: 'Ext.data.Model',
    requires: [
        'Jarvus.connection.Postgrest',
        'Ext.data.identifier.Negative'
    ],


    identifier: 'negative',

    onClassExtended: function(modelCls, data, hooks) {
        var onBeforeClassCreated = hooks.onBeforeCreated,
            modelPath = data.path;

        if (!modelPath) {
            throw modelCls.$className + ' attempting to extend ' + this.$className + ' without defining path';
        }

        hooks.onBeforeCreated = function() {
            var me = this,
                args = arguments;

            // TODO: cache in localStorage?
            Jarvus.connection.Postgrest.request({
                method: 'OPTIONS',
                url: modelPath,
                success: function(response) {
                    var columns = response.data.columns,
                        columnsLength = columns.length, columnIndex = 0, column, field,
                        fields = [];

                    for (; columnIndex < columnsLength; columnIndex++) {
                        column = columns[columnIndex];
                        field = {
                            postgrestColumn: column,

                            name: column.name,
                            allowNull: column.nullable,
                            persist: column.updatable
                        };

                        switch (column.type) {
                            case 'character varying':
                            case 'string':
                                field.type = 'string';
                                break;
                            case 'integer':
                                field.type = 'integer';
                                break;
                        }

                        fields.push(field);
                    }

                    modelCls.addFields(fields);

                    onBeforeClassCreated.apply(me, args);
                }
            });
        };
    }
});