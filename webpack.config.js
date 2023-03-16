const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",

    entry: {
        index: './src/index.ts'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },


    resolve: 
    {
        extensions: ['.ts', '.tsx', '.js'],
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Explorer Prototype',
            favicon: './src/favicon.ico',
        }),
    ],

    module: {
        rules: [

            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },

            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },

            {
                test: /\.(glb|gltf|jpg|jpeg|png)$/,
                type: 'asset/resource',
                generator: {
                    filename: (name) => {
                        const path = name.filename.split("/").slice(1, -1).join("/");
                        return `${path}/[name][ext]`;
                    }
                },
            }
        ]
    }

}