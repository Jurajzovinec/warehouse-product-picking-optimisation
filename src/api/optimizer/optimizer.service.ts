import { Injectable } from '@nestjs/common';
import { BoxPiService } from '../../providers/boxpi/boxpi.service';
import { GetOptimizedInput } from './dto/optimizer-input.dto';
import { KDTreePositions, OptimalPath, Position, PositionDetail } from './optimizer.types';
import { Utils } from '../../shared/utils';
import { BoxApiPositionRes } from '../../providers/boxpi/boxpi.types';
import * as createKDTree from 'static-kdtree';

@Injectable()
export class OptimizerService {
  public constructor(private readonly boxPiService: BoxPiService) {}

  public async getPositions(input: GetOptimizedInput) {
    const { productsNumbers } = input;
    const productionPositions = await this.getProductsPositions(productsNumbers);

    const from = { x: input.xPosition, y: input.yPosition, z: input.zPosition };
    const path = this.getOptimalPath(from, productionPositions);
    const distance = this.getOverallDistance(from, path);
    const instructions = this.getInstructions(path);

    return { instructions, distance, path };
  }

  private async getProductsPositions(productsNumbers: number[]) {
    const productionPositions = await Promise.all(
      productsNumbers.map((product) => this.boxPiService.getPositions(`product-${product}`))
    );
    return productionPositions.flat();
  }

  private getOptimalPath(from: Position, productionPositions: BoxApiPositionRes): OptimalPath {
    const positionDetails = this.getPositionDetail(from, productionPositions);
    const availableProducts = this.getAvailableProducts(positionDetails);
    const positions: KDTreePositions = positionDetails.map(({ position }) => [
      position.x,
      position.y,
      position.z
    ]);

    const path: OptimalPath = [];

    let currentPosition = positions[0];
    while (path.length < availableProducts.length) {
      const kdTree = createKDTree(positions);
      const index = kdTree.nn(currentPosition);
      kdTree.dispose();
      const { isWorker, product, position } = positionDetails[index];
      if (!isWorker && !path.find(({ product: pathProduct }) => pathProduct === product)) {
        path.push({ product, position });
        currentPosition = positions[index];
      }
      this.removeIndexesFromPathArrays(positions, positionDetails, index);
    }

    return path;
  }

  private getOverallDistance(from: Position, path: OptimalPath): number {
    let total = 0;
    let workerPosition = from;

    for (const order of path) {
      const distance = Math.sqrt(
        Math.pow(order.position.x - workerPosition.x, 2) +
          Math.pow(order.position.y - workerPosition.y, 2) +
          Math.pow(order.position.z - workerPosition.z, 2)
      );
      total += distance;
      workerPosition = order.position;
    }
    return total;
  }

  private getPositionDetail(
    from: Position,
    productionPositions: BoxApiPositionRes
  ): PositionDetail[] {
    return [
      {
        position: from,
        isWorker: true
      },
      ...productionPositions.map((position) => ({
        position: {
          x: position.x,
          y: position.y,
          z: position.z
        },
        product: parseInt(position.productId.split('-')[1])
      }))
    ];
  }

  private getAvailableProducts(positionDetails: PositionDetail[]) {
    return Utils.getUniqueArray(
      positionDetails.map((position) => position.product).filter(Boolean)
    );
  }

  private removeIndexesFromPathArrays(
    positions: KDTreePositions,
    positionDetails: PositionDetail[],
    index: number
  ) {
    positions.splice(index, 1);
    positionDetails.splice(index, 1);
  }

  private getInstructions(path: OptimalPath): string[] {
    return path.map(
      ({ product, position }) =>
        `Pick product ${product} from position x:${position.x}, y:${position.y}, z:${position.z}`
    );
  }
}
