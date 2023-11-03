import {decodeSessionToken} from '../../session/decode-session-token';
import {sanitizeShop} from '../../utils/shop-validator';
import {ConfigInterface} from '../../base-types';
import {DataType} from '../../clients/http_client/types';
import {httpClientClass} from '../../clients/http_client/http_client';
import * as ShopifyErrors from '../../error';

import {createSession} from './create-session';

export enum RequestedTokenType {
  OnlineAccessToken = 'urn:shopify:params:oauth:token-type:online-access-token',
  OfflineAccessToken = 'urn:shopify:params:oauth:token-type:offline-access-token',
}

const TokenExchangeGrantType =
  'urn:ietf:params:oauth:grant-type:token-exchange';
const IdTokenType = 'urn:ietf:params:oauth:token-type:id_token';

export interface TokenExchangeParams {
  shop: string;
  sessionToken: string;
  requestedTokenType: RequestedTokenType;
}

export function tokenExchange(config: ConfigInterface) {
  return async ({
    shop,
    sessionToken,
    requestedTokenType,
  }: TokenExchangeParams) => {
    const sessionTokenPayload = await decodeSessionToken(config)(sessionToken);

    const cleanShop = sanitizeShop(config)(shop, true)!;
    const cleanDestFromToken = sanitizeShop(config)(
      sessionTokenPayload.dest,
      true,
    )!;

    if (cleanShop !== cleanDestFromToken) {
      throw new ShopifyErrors.InvalidShopError();
    }

    const body = {
      client_id: config.apiKey,
      client_secret: config.apiSecretKey,
      grant_type: TokenExchangeGrantType,
      subject_token: sessionToken,
      subject_token_type: IdTokenType,
      requested_token_type: requestedTokenType,
    };

    const postParams = {
      path: '/admin/oauth/access_token',
      type: DataType.JSON,
      data: body,
      extraHeaders: {
        Accept: DataType.JSON,
      },
    };

    const HttpClient = httpClientClass(config);
    const client = new HttpClient({domain: cleanShop});
    const postResponse = await client.post(postParams);

    return {
      session: createSession({
        postResponse,
        shop: cleanShop,
        // We need to keep this as an empty string as our template DB schemas have this required
        state: '',
        config,
      }),
    };
  };
}
