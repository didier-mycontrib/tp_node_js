export class ErrorWithStatus extends Error {
    public status: number;
    constructor(msg: string ="internal server error", status: number = 500) {
      super();
      this.message = msg;
      this.status = status;
    }
  };
  
  export class NotFoundError extends ErrorWithStatus {
    constructor(msg: string = "Not Found") {
      super(msg, 404);
    }
  };