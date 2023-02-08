/*jshint esversion: 6 */

import axios from "axios";

export default async function apiRequest(
  url,
  data,
  isPostRequest,
  subscriptionKey
) {
  const instance = axios.create({
    timeout: 1000 * 60 * 1,
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  });
  try {
    var response;
    if (isPostRequest) {
      response = await instance.post(url, data);
    } else {
      response = await instance.get(url);
    }
    const response_data = await response.data;
    return response_data;
  } catch (error) {
    return error;
  }
}
