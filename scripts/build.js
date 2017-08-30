import webpack from 'webpack';
import webpackConfig from '../webpack.config.prod';

process.env.NODE_ENV = 'production';
console.log('building a minified bundle...');

webpack(webpackConfig).run((err,stats)=>{
    if (err){
        conosle.log(err.bold.red);
        return 1;
    }

    const jsonStats = stats.toJson();

    if(jsonStats.hasErrors){
        return jsonStats.errors.map(err=>console.log(err));
    }
    if(jsonStats.hasWarnings){  
        jsonStats.warnings.map(warning=> console.log(warning));
    }

    console.log(`webpack stats: ${stats}`);
    console.log('app bundled');
    return 0;
});