export class LeverageService {
  private defaultLeverage: number = 1
  constructor(private readonly staticLeverage: number) {}
  getLeverage(): number {
    if (this.staticLeverage) {
      return this.staticLeverage
    }

    return this.defaultLeverage
  }
}
