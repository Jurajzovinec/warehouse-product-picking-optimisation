import { BoxApiPositionRes } from '../../providers/boxpi/boxpi.types';

export type Position = {
  x: number;
  y: number;
  z: number;
};

export type GetPlanInput = {
  xPosition: number;
  yPosition: number;
  zPosition: number;
  productsNumbers: number[];
  productionPositions: BoxApiPositionRes;
};

export type OptimalPath = {
  product: number;
  position: Position;
}[];

export type PositionDetail = {
  position: Position;
  product?: number;
  isWorker?: boolean;
};

export type KDTreePositions = [number, number, number][];
