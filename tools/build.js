import webpack from 'webpack';
import webpackConfig from '../webpack.config.prod';

process.env.NODE_ENV = 'production';
console.log('Generating minified bundel for production...');

webpack(webpackConfig).run((err,stats)=>{
    if (err){
        console.log(err);
        return 1;
    }

    const jsonStats = stats.toJson();

    if (jsonStats.hasErrors){
        return jsonStates.errors.map(error=> console.log(error));
    }

    if (jsonStats.hasWarnings){
        jsonStats.warnings.map(warning=> console.log(warning.yellow));
    }

    console.log(`Webpack stats: ${stats}`);
    return 0;
});