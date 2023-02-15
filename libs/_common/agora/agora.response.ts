import { generateGqlResponseType } from '../graphql/graphql-response.type';
import {
  GenerateAgoraTokenResponse,
  AgoraRequestReplyResponse,
  AgoraChangeStatusResponse
} from './agora.type';

export const GqlGenerateAgoraTokenResponse = generateGqlResponseType(GenerateAgoraTokenResponse);
export const GqlAgoraRequestReplyResponse = generateGqlResponseType(AgoraRequestReplyResponse);
export const GqlAgoraChangeStatusResponse = generateGqlResponseType(AgoraChangeStatusResponse);
