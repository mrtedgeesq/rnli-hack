module.exports = {

    entry: {
        app: './main.js'
    },

    output: {
        filename: "index.js"
    },

    devServer: {
        inline: true,
        port: 3000
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        query: {
                            presets: ['es2015', 'react', 'stage-0']
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    }

};