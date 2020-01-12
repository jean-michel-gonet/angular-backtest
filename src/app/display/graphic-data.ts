import { Observable } from 'rxjs';

export enum GraphicDataType {
  STATUS,
  CONTINUOUS,
  DISCRETE
}

export class GraphicData {
  x: number;
  y: Date;
}

/**
 * Any class providing graphic data should implement
 * this interface.
 * @interface GraphicDataProvider
 */
export interface GraphicDataProvider {
  graphicDataName: string;
  graphicDataType: GraphicDataType;

  getGraphicData():Observable<GraphicData>;
}
