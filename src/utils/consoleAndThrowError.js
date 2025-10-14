const consoleAndThrowError = (...arg) => {
    const msg = Array.prototype.slice.call(arg).join(' ');
    console.log('//////////////////////////////////////////////////////////');
    console.log(msg);
    throw new Error(msg);
};
export default consoleAndThrowError;
