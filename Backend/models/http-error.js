class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); //Adding message property
        this.code = errorCode; //adding code property
    };
};

module.exports = HttpError;