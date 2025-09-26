import { Response } from "express";
import httpStatus from "http-status";

interface ApiResponseData {
  success: boolean;
  message: string;
  data: any;
}

const apiResponse = (
  res: Response,
  message: string,
  data: any,
  status: number = httpStatus.OK
): void => {
  const response: ApiResponseData = {
    success: true,
    message,
    data,
  };
  res.status(status).send(response);
};

export default apiResponse;
