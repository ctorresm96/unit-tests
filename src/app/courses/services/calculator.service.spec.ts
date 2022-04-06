import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe("CalculatorService", () => {
  it("should add two numbers", () => {
    const calculatorService = new CalculatorService(new LoggerService());
    const result = calculatorService.add(2, 2);

    expect(result).toBe(4);
  });

  it("should subsctract two numbers", () => {
    const calculatorService = new CalculatorService(new LoggerService());
    const result = calculatorService.subtract(2, 2);

    expect(result).toBe(0);
  });
});
