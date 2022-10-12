/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath} from '../../types';
import {SessionInterface} from '../../../lib/session/types';
import {ApiVersion} from '../../../lib/base-types';

interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  assignment_status?: unknown;
  location_ids?: unknown[] | number | string | null;
}

export class AssignedFulfillmentOrder extends Base {
  public static API_VERSION = ApiVersion.April22;

  protected static NAME = 'assigned_fulfillment_order';
  protected static PLURAL_NAME = 'assigned_fulfillment_orders';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "assigned_fulfillment_orders.json"}
  ];

  public static async all(
    {
      session,
      assignment_status = null,
      location_ids = null,
      ...otherArgs
    }: AllArgs
  ): Promise<AssignedFulfillmentOrder[]> {
    const response = await this.baseFind<AssignedFulfillmentOrder>({
      session: session,
      urlIds: {},
      params: {"assignment_status": assignment_status, "location_ids": location_ids, ...otherArgs},
    });

    return response;
  }

  public assigned_location_id: number | null;
  public destination: {[key: string]: unknown} | null;
  public id: number | null;
  public line_items: {[key: string]: unknown}[] | null;
  public order_id: number | null;
  public request_status: string | null;
  public shop_id: number | null;
  public status: string | null;
}