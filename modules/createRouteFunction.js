import { firstLetterUpperCase } from "./utils";
import analyzePath from './analyzePath';

function createMountPathFunction(fn, pathInfo){

	const urlTemplate = pathInfo.path.replace(/:(\w*)/g,'${$1}');
	const body = 'return fn(`' + urlTemplate + '`)';
	return 	pathInfo.variables.length > 0 ?
		new Function('fn',pathInfo.variables, body).bind(null, fn) :
		new Function('fn', body).bind(null, fn);

}

const defaultOpts = {
	suffix : "goTo",
	defaultPath : "Index"
};

function createRouteFunction(routingImpl, path, alias, opts = defaultOpts){

	if(path.indexOf('*') !== -1) return null;

	opts = Object.assign({},defaultOpts,opts);

	let name = firstLetterUpperCase(alias);
	const pathInfo = analyzePath(path);
	if(!name){
		name = pathInfo.joinedTokens.length === 0 ? opts.defaultPath : pathInfo.joinedTokens;
	}
	const funcName = `${opts.suffix}${name}`;
	return {
		[funcName]: createMountPathFunction.call(null, routingImpl, pathInfo )
	}
}

export default createRouteFunction;