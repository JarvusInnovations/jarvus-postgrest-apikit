Ext.define('PostgrestTest.overrides.PostgrestConnection', {
	override: 'Jarvus.connection.Postgrest'
}, function(PostgrestConnection) {
    var pageParams = Ext.Object.fromQueryString(location.search);

	// Configure connection while it's being required so that it's ready to go for any classes that require it
    if (pageParams.postgrestHost) {
        PostgrestConnection.setHost(pageParams.postgrestHost);
    } else {
        PostgrestConnection.setUseSSL(true);
        PostgrestConnection.setHost('postgrest.herokuapp.com');
        // PostgrestConnection.setPathPrefix('/path/to/optional/proxy');
    }
});