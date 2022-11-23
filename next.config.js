const withImages = require('next-images');
// var rootCas = require('ssl-root-cas').create();
// require('https').globalAgent.options.ca = rootCas;

module.exports = withImages({
    future: {
        webpack5: true,
    },
    webpack: function (config, { webpack }) {
        config.module.rules.push({
            test: /\.(eot|svg|gif|md|woff|woff2|ttf)$/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                { loader: 'less-loader' }
            ]
        })
        config.plugins.push(
            new webpack.IgnorePlugin({ resourceRegExp: /^(vertx|bufferutil|utf-8-validate|@sap\/hana-client|mongodb|mssql|mysql|mysql2|ioredis|hdb-pool|better-sqlite3|pg-native|pg-query-stream|typeorm-aurora-data-api-driver|oracledb|redis|sqlite3|pg|sql.js|react-native-sqlite-storage)$/u })
        )

        return config
    },
})
