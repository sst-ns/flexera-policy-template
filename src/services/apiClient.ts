import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import axios from "axios";

const lambdaClient = new LambdaClient({
  region: import.meta.env.VITE_REACT_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_REACT_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_REACT_AWS_SECRET_KEY,
  },
});

const LAMBDA_ENDPOINTS = {
  lambda_FTG_integrationlambda: "FTG_IntegrationLambda",
  default: "",
};

type EndpointKey = keyof typeof LAMBDA_ENDPOINTS;

const ApiClient = {
  // get request
  get: async (endpoint: EndpointKey, params: any = {}, headers: any = {}) => {
    try {
      const URL = LAMBDA_ENDPOINTS[endpoint] || "";
      const response = await axios.get(URL, { params, headers });
      console.log(`GET RESPONSE ${URL}:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`GET REQUEST ERROR:`, error);
      throw error.response ? error.response.data : error;
    }
  },

  //   post request
  post: async (
    endpoint: EndpointKey,
    data: any,
    headers: Record<string, string> = {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    }
  ) => {
    try {
      const functionName = LAMBDA_ENDPOINTS[endpoint];
      if (functionName) {
        // lambda post
        const command = new InvokeCommand({
          FunctionName: functionName,
          //   Payload: JSON.stringify(data),
          Payload: JSON.stringify({ body: JSON.stringify(data) }),
        });

        const response = await lambdaClient.send(command);
        // console.log("Response", response);
        if (!response.Payload) return null;
        const decoded = new TextDecoder().decode(response.Payload);
        console.log(`[LAMBDA decoded RESPONSE] ${functionName}:`, decoded);
        return JSON.parse(decoded);
      } else {
        // Normal HTTP post
        const response = await axios.post(functionName, data, { headers });
        console.log(`[NORMAL POST RESPONSE] ${functionName}:`, response.data);

        return response.data;
      }
    } catch (error: any) {
      console.error("POST request error:", error);
      throw error.response ? error.response.data : error;
    }
  },
};

export default ApiClient;
